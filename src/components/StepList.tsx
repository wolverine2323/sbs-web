import { pad2 } from "@/lib/format";

type Step = { title: string; description: string };

// Pasos numerados de la sección de reserva (sobre ink).
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="flex flex-col gap-3 border-t border-bronze-light pt-6"
        >
          {/* La lista ya anuncia el número a los lectores de pantalla. */}
          <span
            aria-hidden="true"
            className="font-serif text-[40px] leading-none text-bronze-light italic"
          >
            {pad2(i + 1)}
          </span>
          <h3 className="text-[17px] font-semibold">{step.title}</h3>
          <p className="text-[14.5px] leading-[1.65] text-stone">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
