import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { type Filme, filmeSchema } from "../types";

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: "",
    sinopse: "",
    classificacao: "",
    duracao: 0,
    genero: "",
    dataEstreia: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/filmes")
      .then((r) => r.json())
      .then(setFilmes);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validação Zod
      const dadosValidos = filmeSchema.parse(formData);
      setErrors({});

      await fetch("http://localhost:3000/filmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosValidos),
      });

      toast.success("Filme cadastrado!");
      window.location.reload();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.issues.forEach((error) => {
          fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleDelete = (id: string) => {
    toast("Deseja realmente excluir este filme?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          try {
            await fetch(`http://localhost:3000/filmes/${id}`, {
              method: "DELETE",
            });
            setFilmes(filmes.filter((f) => f.id !== id));
            toast.success("Filme excluído!");
          } catch (error) {
            toast.error("Falha ao excluir filme.");
            console.error(error);
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  return (
    <div className="container">
      <h2>Gerenciar Filmes</h2>
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Título</label>
            <input
              type="text"
              className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
            {errors.titulo && (
              <div className="invalid-feedback">{errors.titulo}</div>
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label">Duração (min)</label>
            <input
              type="number"
              className={`form-control ${errors.duracao ? "is-invalid" : ""}`}
              value={formData.duracao}
              onChange={(e) =>
                setFormData({ ...formData, duracao: Number(e.target.value) })
              }
            />
            {errors.duracao && (
              <div className="invalid-feedback">{errors.duracao}</div>
            )}
          </div>
          <div className="col-md-3">
            <label className="form-label">Gênero</label>
            <input
              type="text"
              className={`form-control ${errors.genero ? "is-invalid" : ""}`}
              value={formData.genero}
              onChange={(e) =>
                setFormData({ ...formData, genero: e.target.value })
              }
            />
            {errors.genero && (
              <div className="invalid-feedback">{errors.genero}</div>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">Sinopse</label>
            <textarea
              className={`form-control ${errors.sinopse ? "is-invalid" : ""}`}
              value={formData.sinopse}
              onChange={(e) =>
                setFormData({ ...formData, sinopse: e.target.value })
              }
            />
            {errors.sinopse && (
              <div className="invalid-feedback">{errors.sinopse}</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Classificação</label>
            <input
              type="text"
              className={`form-control ${
                errors.classificacao ? "is-invalid" : ""
              }`}
              value={formData.classificacao}
              onChange={(e) =>
                setFormData({ ...formData, classificacao: e.target.value })
              }
            />
            {errors.classificacao && (
              <div className="invalid-feedback">{errors.classificacao}</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Data</label>
            <input
              type="date"
              className={`form-control ${
                errors.dataEstreia ? "is-invalid" : ""
              }`}
              value={formData.dataEstreia}
              onChange={(e) =>
                setFormData({ ...formData, dataEstreia: e.target.value })
              }
            />
            {errors.dataEstreia && (
              <div className="invalid-feedback">{errors.dataEstreia}</div>
            )}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-save"></i> Salvar
            </button>
          </div>
        </div>
      </form>

      {/* Listagem */}
      <div className="row">
        {filmes.map((filme) => (
          <div className="col-md-4 mb-3" key={filme.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-film"></i> {filme.titulo}
                </h5>
                <p className="card-text">{filme.sinopse}</p>
                <p className="small text-primary">
                  {filme.genero} | {filme.duracao} min
                </p>
                <button
                  onClick={() => handleDelete(filme.id)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash"></i> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
