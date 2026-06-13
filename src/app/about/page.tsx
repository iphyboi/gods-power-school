import React from "react";
import Image from "next/image";

export default function AboutSchool() {
    return (
        <section id="about" className="py-20 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-16">

                {/* top section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* single hero image */}
                    <div className="relative h-[350px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 group">
                        <Image
                        src="/images/photo-3.jpg"
                        alt="Gods Power International High School"
                        fill
                        priority
                        sizes="(max-w-768px) 100vw, 50vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* text content */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
                                Welcome to Our School
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                                Nurturing Leaders of Tomorrow
                            </h2>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                          At Gods Power International High School, we are dedicated to providing
                          an all-round, qualitative education that equips students with both intellectual
                          prowess and strong moral values. Our learning facilities offer an environment
                          where academic excellence thrives.
                        </p>

                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                            Through a robust curriculum combined with modern technology, practical sciences,
                            and dedicated mentorship, we guide our students to discover their full potential
                            and prepare them to impact the global stage.
                        </p>

                        {/* quick stats grid */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center sm:text-left">
                            <div>
                                <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">100%</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">WAEC Pass Rate</span>
                            </div>

                            <div>
                                <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">Modern</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Science Labs</span>
                            </div>

                            <div>
                                <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">Expert</span>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Educators</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* bottom section*/}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">

                    {/* our mission */}
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
                        Target
                        </div>
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Our Mission</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            To deliver world-class academic training grounded in discipline administration integrity,
                            enabling every child to excel spiritually, morally, and intellectually.
                        </p>
                    </div>

                    {/* our vision */}
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-3">
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-blue-500/10 text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Vision
                        </div>
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Our Vision</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            To stand as a beacon of academic distinction, raising a generation of
                            confident global leaders who utilize knowledge to transform society.
                        </p>
                    </div>

                    {/* our core value */}
                    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-3 sm:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 text-lg">
                        Values
                        </div>
                        <h3 className="font-old text-lg text-zinc-900 dark:text-white">Core Value</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Academic Excellence, Fear of God, High Integrity, Discipline, and Mutual Respect in everything we do.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}