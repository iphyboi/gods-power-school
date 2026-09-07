import Image from "next/image";
import Link from "next/link";

const programs = [
  {
    title: "Junior Secondary",
    subtitle: "JSS 1 – JSS 3",
    description:
      "A strong academic foundation that develops confidence, discipline and independent learning.",
  },
  {
    title: "Senior Secondary",
    subtitle: "SS 1 – SS 3",
    description:
      "Focused academic preparation designed to help students excel in WAEC, NECO and other examinations.",
  },
  {
    title: "Science",
    subtitle: "Science Department",
    description:
      "Building analytical thinking and practical knowledge through mathematics, sciences and technology.",
  },
  {
    title: "Arts & Humanities",
    subtitle: "Arts Department",
    description:
      "Encouraging creativity, communication, critical thinking and a deeper understanding of society.",
  },
  {
    title: "Commercial",
    subtitle: "Commercial Department",
    description:
      "Preparing students with knowledge of business, accounting, economics and entrepreneurship.",
  },
];

const reasons = [
  {
    number: "01",
    title: "Academic Excellence",
    text: "We create an environment where students are encouraged to learn, question and achieve their full academic potential.",
  },
  {
    number: "02",
    title: "Character & Discipline",
    text: "Education goes beyond the classroom. We encourage responsibility, respect, integrity and good character.",
  },
  {
    number: "03",
    title: "Qualified Teachers",
    text: "Our learning environment is supported by dedicated teachers committed to helping every student progress.",
  },
  {
    number: "04",
    title: "Future Ready",
    text: "Students are prepared with the knowledge, confidence and skills needed for the next stage of their education.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-white text-slate-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <Image
            src="/images/school-building.jpg"
            alt="God's Power International High School"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/75" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">

            {/* LOGO */}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-white p-2 shadow-2xl">
                <Image
                  src="/images/logo.png"
                  alt="School Logo"
                  width={105}
                  height={105}
                  className="rounded-full"
                />
              </div>
            </div>

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
              Welcome to
            </p>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-7xl">
              God&apos;s Power
              <span className="block text-amber-400">
                International High School
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Building confident, disciplined and academically prepared
              students through quality education, character development and
              a supportive learning environment.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/about"
                className="rounded-xl bg-amber-400 px-7 py-3.5 font-bold text-slate-950 transition hover:bg-amber-300"
              >
                Explore Our School
              </Link>

              <Link
                href="/check-result"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Check Result
              </Link>
            </div>

            <p className="mt-8 text-sm font-medium italic text-slate-300">
              &quot;In God We Trust&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ACCREDITATION STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
          {["WAEC", "NECO", "NABTEB", "JAMB CBT"].map((item) => (
            <div
              key={item}
              className="px-5 py-7 text-center"
            >
              <p className="text-xl font-black text-slate-900">
                {item}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Examination Preparation
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO */}
      <section className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            About Our School
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Education with purpose.
            <br />
            Excellence with character.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            At God&apos;s Power International High School, we believe that
            true education develops the whole student. Our goal is to provide
            quality academic instruction while nurturing discipline,
            confidence, responsibility and strong moral values.
          </p>

          <Link
            href="/about"
            className="mt-8 inline-flex rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-slate-800"
          >
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* SCHOOL IMAGE */}
      <section className="px-6 pb-20 sm:px-10 lg:px-12">
        <div className="relative mx-auto h-[320px] max-w-7xl overflow-hidden rounded-3xl shadow-xl sm:h-[430px]">
          <Image
            src="/images/school-building.jpg"
            alt="God's Power International High School building"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
              Our Learning Environment
            </p>

            <h3 className="mt-2 max-w-xl text-2xl font-black text-white sm:text-3xl">
              A place where students learn, grow and prepare for the future.
            </h3>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-slate-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Academics
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Learning designed for every stage
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              From junior secondary education to senior secondary
              specialization, we provide students with a strong foundation
              for their academic journey.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <div
                key={program.title}
                className={`rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  index === 0 ? "lg:col-span-1" : ""
                }`}
              >
                <span className="text-sm font-black text-blue-600">
                  0{index + 1}
                </span>

                <h3 className="mt-4 text-xl font-black text-slate-950">
                  {program.title}
                </h3>

                <p className="mt-1 text-sm font-semibold text-amber-600">
                  {program.subtitle}
                </p>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-slate-950 px-6 py-20 text-white sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              More than a school.
              <br />
              A foundation for the future.
            </h2>
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {reasons.map((reason) => (
              <div
                key={reason.number}
                className="border-t border-white/15 pt-6"
              >
                <span className="text-sm font-black text-amber-400">
                  {reason.number}
                </span>

                <h3 className="mt-3 text-xl font-bold">
                  {reason.title}
                </h3>

                <p className="mt-3 max-w-xl leading-7 text-slate-300">
                  {reason.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT SERVICES */}
      <section className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Student Services
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Everything students and parents need
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              href="/check-result"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="text-3xl font-black text-blue-600">
                →
              </div>
              <h3 className="mt-6 font-black text-slate-950">
                Check Result
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access student academic results securely.
              </p>
            </Link>

            <Link
              href="/upload-payment"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="text-3xl font-black text-blue-600">
                →
              </div>
              <h3 className="mt-6 font-black text-slate-950">
                Payment Services
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Upload payment proof and manage payment information.
              </p>
            </Link>

            <Link
              href="/attendance"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="text-3xl font-black text-blue-600">
                →
              </div>
              <h3 className="mt-6 font-black text-slate-950">
                Attendance
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access student attendance services and information.
              </p>
            </Link>

            <Link
              href="/announcements"
              className="group rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="text-3xl font-black text-blue-600">
                →
              </div>
              <h3 className="mt-6 font-black text-slate-950">
                Announcements
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Stay informed about important school updates.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="bg-slate-50 px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-5xl text-center">

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Stay Informed
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            Latest School Announcements
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            Keep up with important information, events and activities from
            the school.
          </p>

          <Link
            href="/announcements"
            className="mt-8 inline-flex rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-bold text-slate-900 transition hover:border-slate-950"
          >
            View Announcements
          </Link>
        </div>
      </section>

      {/* SCHOOL LIFE */}
      <section className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                School Life
              </p>

              <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
                Life beyond the classroom
              </h2>
            </div>

            <Link
              href="/gallery"
              className="font-bold text-blue-600 hover:text-blue-800"
            >
              View Gallery →
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="relative h-72 overflow-hidden rounded-2xl md:col-span-2">
              <Image
                src="/images/school-building.jpg"
                alt="School environment"
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div className="flex min-h-72 flex-col justify-center rounded-2xl bg-slate-950 p-8 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-400">
                Community
              </p>

              <h3 className="mt-4 text-2xl font-black">
                Growing together as a school community.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Our students are encouraged to participate, collaborate and
                develop confidence both inside and outside the classroom.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-20 sm:px-10 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-700 px-7 py-16 text-center shadow-2xl sm:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
            Start the Journey
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            Give your child a strong foundation for a successful future.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Discover a learning environment focused on academic excellence,
            discipline, character and personal development.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Contact the School
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-white/30 px-7 py-3.5 font-bold text-white transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          <div>
            <h3 className="font-black">
              God&apos;s Power International High School
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              &quot;In God We Trust&quot;
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400 sm:justify-end">
            <Link href="/about" className="hover:text-white">
              About
            </Link>

            <Link href="/gallery" className="hover:text-white">
              Gallery
            </Link>

            <Link href="/announcements" className="hover:text-white">
              Announcements
            </Link>

            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} God&apos;s Power International High
          School. All rights reserved.
        </div>
      </footer>

    </main>
  );
}