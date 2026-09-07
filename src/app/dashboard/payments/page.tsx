"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Payment {
  _id: string;
  studentId?: {
    _id?: string;
    fullName?: string;
    name?: string;
    class?: string;
  };
  totalFee: number;
  amountPaid: number;
  balance: number;
  status: string;
  paymentMethod: string;
  session: string;
  term: string;
  receiptUrl?: string;
}

interface Student {
  _id: string;
  fullName: string;
  class?: string;
}

export default function PaymentsPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<"view" | "add">("view");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [session, setSession] = useState("2026/2027");
  const [term, setTerm] = useState("First Term");

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [formTotalFee, setFormTotalFee] = useState("");
  const [formAmountPaid, setFormAmountPaid] = useState("");
  const [formPaymentMethod, setFormPaymentMethod] =
    useState("Cash");

  // =========================
  // MONEY FORMATTER
  // =========================

  const money = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // =========================
  // FETCH PAYMENTS
  // =========================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/payments");

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data = await response.json();

      const paymentArray = Array.isArray(data)
        ? data
        : data.payments || [];

      setPayments(paymentArray);
    } catch (error) {
      console.error("FETCH PAYMENTS ERROR:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      setStudentsLoading(true);

      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      const studentArray = Array.isArray(data)
        ? data
        : data.students || [];

      setStudents(studentArray);
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  // =========================
  // FILTER PAYMENTS
  // =========================

  const filteredPayments = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const studentName =
        payment.studentId?.fullName ||
        payment.studentId?.name ||
        "";

      const studentClass =
        payment.studentId?.class || "";

      const matchesSearch =
        searchTerm === "" ||
        studentName
          .toLowerCase()
          .includes(searchTerm) ||
        studentClass
          .toLowerCase()
          .includes(searchTerm) ||
        payment.status
          .toLowerCase()
          .includes(searchTerm) ||
        payment.paymentMethod
          .toLowerCase()
          .includes(searchTerm);

      const matchesSession =
        payment.session === session;

      const matchesTerm =
        payment.term === term;

      return (
        matchesSearch &&
        matchesSession &&
        matchesTerm
      );
    });
  }, [payments, search, session, term]);

  // =========================
  // PAYMENT SUMMARY
  // =========================

  const summary = useMemo(() => {
    return filteredPayments.reduce(
      (acc, payment) => {
        acc.totalFee += Number(
          payment.totalFee || 0
        );

        acc.amountPaid += Number(
          payment.amountPaid || 0
        );

        acc.balance += Number(
          payment.balance || 0
        );

        if (
          payment.status === "Paid" ||
          payment.status === "Fully paid"
        ) {
          acc.paidCount += 1;
        }

        if (
          payment.status === "Part Payment"
        ) {
          acc.partPaymentCount += 1;
        }

        return acc;
      },
      {
        totalFee: 0,
        amountPaid: 0,
        balance: 0,
        paidCount: 0,
        partPaymentCount: 0,
      }
    );
  }, [filteredPayments]);

  // =========================
  // ADD PAYMENT
  // =========================

  const handleAddNewPayment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    const total = Number(formTotalFee);
    const paid = Number(formAmountPaid);

    if (total <= 0) {
      alert("Please enter a valid total fee.");
      return;
    }

    if (paid <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    if (paid > total) {
      alert(
        "Amount paid cannot be greater than the total fee."
      );
      return;
    }

    const calculatedBalance = total - paid;

    const computedStatus =
      calculatedBalance <= 0
        ? "Paid"
        : "Part Payment";

    try {
      setUpdating(true);

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: selectedStudent._id,
          totalFee: total,
          amountPaid: paid,
          balance: calculatedBalance,
          status: computedStatus,
          paymentMethod: formPaymentMethod,
          session,
          term,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to record payment."
        );
        return;
      }

      alert(
        `Payment recorded successfully for ${selectedStudent.fullName}.`
      );

      setSelectedStudent(null);
      setFormTotalFee("");
      setFormAmountPaid("");
      setFormPaymentMethod("Cash");

      await fetchPayments();

      setActiveTab("view");

      router.refresh();
    } catch (error) {
      console.error(
        "ADD PAYMENT ERROR:",
        error
      );

      alert(
        "An error occurred while recording the payment."
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // DELETE PAYMENT
  // =========================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/payment/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            data.error ||
            "Failed to delete payment."
        );
        return;
      }

      alert(
        "Payment record deleted successfully."
      );

      await fetchPayments();
    } catch (error) {
      console.error(
        "DELETE PAYMENT ERROR:",
        error
      );

      alert(
        "An error occurred while deleting the payment."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading && activeTab === "view") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="text-gray-600">
            Loading payment records...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage student fees, payment records,
            balances and receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <select
            value={session}
            onChange={(e) =>
              setSession(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            {Array.from(
              { length: 5 },
              (_, index) => {
                const startYear =
                  new Date().getFullYear() -
                  2 +
                  index;

                const endYear =
                  startYear + 1;

                const sessionString =
                  `${startYear}/${endYear}`;

                return (
                  <option
                    key={sessionString}
                    value={sessionString}
                  >
                    {sessionString}
                  </option>
                );
              }
            )}
          </select>

          <select
            value={term}
            onChange={(e) =>
              setTerm(e.target.value)
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="First Term">
              First Term
            </option>

            <option value="Second Term">
              Second Term
            </option>

            <option value="Third Term">
              Third Term
            </option>
          </select>

        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Expected Fees
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {money(summary.totalFee)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {filteredPayments.length} payment record
            {filteredPayments.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-green-700">
            Amount Collected
          </p>

          <p className="mt-2 text-2xl font-bold text-green-800">
            {money(summary.amountPaid)}
          </p>

          <p className="mt-1 text-xs text-green-700">
            {summary.paidCount} fully paid
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-orange-700">
            Outstanding
          </p>

          <p className="mt-2 text-2xl font-bold text-orange-800">
            {money(summary.balance)}
          </p>

          <p className="mt-1 text-xs text-orange-700">
            {summary.partPaymentCount} part payment
            {summary.partPaymentCount !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-700">
            Current Selection
          </p>

          <p className="mt-2 text-lg font-bold text-blue-900">
            {session}
          </p>

          <p className="mt-1 text-xs text-blue-700">
            {term}
          </p>
        </div>

      </div>

      {/* TABS + SEARCH */}

      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">

        <div className="flex w-fit rounded-xl bg-gray-100 p-1">

          <button
            type="button"
            onClick={() =>
              setActiveTab("view")
            }
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "view"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Payment History
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("add")
            }
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "add"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            + Record Payment
          </button>

        </div>

        {activeTab === "view" && (
          <div className="w-full lg:max-w-sm">

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student, class or method..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

          </div>
        )}

      </div>

      {/* PAYMENT HISTORY */}

      {activeTab === "view" && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {filteredPayments.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                ₦
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                No payment records found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                No payments match the selected
                session, term or search.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-gray-50">

                  <tr className="border-b border-gray-200">

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Student
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Fee
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Paid
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Balance
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Method
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Receipt
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredPayments.map(
                    (payment) => {

                      const studentName =
                        payment.studentId
                          ?.fullName ||
                        payment.studentId
                          ?.name ||
                        "Unknown Student";

                      const studentClass =
                        payment.studentId
                          ?.class ||
                        "Unassigned";

                      const isPaid =
                        payment.status ===
                          "Paid" ||
                        payment.status ===
                          "Fully paid";

                      return (
                        <tr
                          key={payment._id}
                          className="transition hover:bg-gray-50"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                {studentName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  {studentName}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {studentClass}
                                </p>
                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-900">
                            {money(
                              payment.totalFee
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-green-700">
                            {money(
                              payment.amountPaid
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-red-600">
                            {money(
                              payment.balance
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                isPaid
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {payment.status}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-gray-700">
                            {payment.paymentMethod}
                          </td>

                          <td className="px-5 py-4">

                            {payment.receiptUrl ? (
                              <a
                                href={
                                  payment.receiptUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                View Receipt
                              </a>
                            ) : (
                              <span className="text-xs italic text-gray-400">
                                No receipt
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  payment._id
                                )
                              }
                              className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* RECORD PAYMENT */}

      {activeTab === "add" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">

          {/* STUDENT LIST */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                Select Student
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose a registered student to
                record a payment.
              </p>
            </div>

            {studentsLoading ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  No registered students available.
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] space-y-2 overflow-y-auto pr-1">

                {students.map((student) => {

                  const selected =
                    selectedStudent?._id ===
                    student._id;

                  return (
                    <button
                      type="button"
                      key={student._id}
                      onClick={() =>
                        setSelectedStudent(
                          student
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-700">
                          {student.fullName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {student.fullName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {student.class ||
                              "Unassigned"}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selected
                          ? "Selected"
                          : "Select"}
                      </span>

                    </button>
                  );
                })}

              </div>
            )}

          </div>

          {/* PAYMENT FORM */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            {selectedStudent ? (
              <form
                onSubmit={
                  handleAddNewPayment
                }
                className="space-y-6"
              >

                <div className="border-b border-gray-200 pb-5">

                  <p className="text-sm font-medium text-gray-500">
                    Recording payment for
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {selectedStudent.fullName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {selectedStudent.class ||
                      "Class not assigned"}
                  </p>

                </div>

                <div className="rounded-xl bg-blue-50 p-4">

                  <p className="text-xs font-medium text-blue-600">
                    Payment period
                  </p>

                  <p className="mt-1 font-bold text-blue-900">
                    {session} · {term}
                  </p>

                </div>

                {/* TOTAL FEE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Total Expected Fee
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                      ₦
                    </span>

                    <input
                      type="number"
                      min="1"
                      required
                      value={formTotalFee}
                      onChange={(e) =>
                        setFormTotalFee(
                          e.target.value
                        )
                      }
                      placeholder="80000"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                  </div>
                </div>

                {/* AMOUNT PAID */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Amount Paid
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-500">
                      ₦
                    </span>

                    <input
                      type="number"
                      min="1"
                      required
                      value={formAmountPaid}
                      onChange={(e) =>
                        setFormAmountPaid(
                          e.target.value
                        )
                      }
                      placeholder="50000"
                      className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                  </div>
                </div>

                {/* LIVE BALANCE */}

                {formTotalFee &&
                  formAmountPaid && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                      <div className="flex items-center justify-between">

                        <span className="text-sm font-medium text-gray-600">
                          Remaining Balance
                        </span>

                        <span className="text-lg font-bold text-red-600">
                          {money(
                            Math.max(
                              0,
                              Number(
                                formTotalFee
                              ) -
                                Number(
                                  formAmountPaid
                                )
                            )
                          )}
                        </span>

                      </div>

                    </div>
                  )}

                {/* PAYMENT METHOD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Method
                  </label>

                  <select
                    value={
                      formPaymentMethod
                    }
                    onChange={(e) =>
                      setFormPaymentMethod(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>

                    <option value="POS">
                      POS
                    </option>
                  </select>
                </div>

                {/* BUTTONS */}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudent(
                        null
                      )
                    }
                    disabled={updating}
                    className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Change Student
                  </button>

                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updating
                      ? "Saving Payment..."
                      : "Save Payment"}
                  </button>

                </div>

              </form>
            ) : (
              <div className="flex min-h-[450px] items-center justify-center">

                <div className="max-w-sm text-center">

                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    ₦
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Select a Student
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Choose a student from the list
                    to begin recording their payment.
                  </p>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}