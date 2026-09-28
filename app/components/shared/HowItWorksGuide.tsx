"use client";

type GuideStep = {
  title: string;
  body: string;
};

type GuideSection = {
  heading: string;
  steps: GuideStep[];
};

type HowItWorksGuideProps = {
  title: string;
  intro: string;
  sections: GuideSection[];
};

const HowItWorksGuide = ({ title, intro, sections }: HowItWorksGuideProps) => {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#101828] sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#475467] sm:text-base">
          {intro}
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.heading} className="space-y-4">
          <h2 className="border-b border-[#E4E7EC] pb-2 text-lg font-semibold text-[#03442C]">
            {section.heading}
          </h2>
          <ol className="space-y-4">
            {section.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9F4E7] text-sm font-semibold text-[#03442C]">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-[#101828]">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#475467]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default HowItWorksGuide;
