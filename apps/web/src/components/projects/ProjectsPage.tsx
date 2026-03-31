import { projects } from "@/lib/mock-data";

export function ProjectsPage() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">Gestão de Projetos</h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <h3 className="font-semibold text-brand-400">{project.name}</h3>
            <p className="text-sm text-zinc-400">Criticidade: {project.criticality} · Custo/hora: R$ {project.hourlyRate}</p>
            <p className="mt-1 text-sm text-zinc-300">Receita esperada: R$ {project.expectedRevenue}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
