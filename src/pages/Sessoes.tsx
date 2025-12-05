import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { type Sessao, type Filme, type Sala, sessaoSchema } from "../types";

export function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [formData, setFormData] = useState({
    filmeId: "",
    salaId: "",
    dataHora: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/sessoes").then((r) => r.json()),
      fetch("http://localhost:3000/filmes").then((r) => r.json()),
      fetch("http://localhost:3000/salas").then((r) => r.json()),
    ]).then(([sessoesData, filmesData, salasData]) => {
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dados = sessaoSchema.parse(formData);
      setErrors({});

      const payload = {
        filmeId: dados.filmeId,
        salaId: dados.salaId,
        dataHora: dados.dataHora,
      };

      await fetch("http://localhost:3000/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success("Sessão agendada!");
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

  const venderIngresso = (sessaoId: string) => {
    toast("Qual tipo de ingresso deseja vender?", {
      action: {
        label: "Inteira (R$ 20)",
        onClick: () => processarVenda(sessaoId, "Inteira", 20),
      },
      cancel: {
        label: "Meia (R$ 10)",
        onClick: () => processarVenda(sessaoId, "Meia", 10),
      },
    });
  };

  const processarVenda = async (
    sessaoId: string,
    tipo: string,
    valor: number,
  ) => {
    try {
      await fetch("http://localhost:3000/ingressos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessaoId, tipo, valor }),
      });
      toast.success(
        `Ingresso (${tipo}) vendido! Valor: R$ ${valor.toFixed(2)}`,
      );
    } catch (error) {
      toast.error("Falha ao vender ingresso. Tente novamente.");
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    toast("Deseja realmente excluir esta sessão?", {
      action: {
        label: "Excluir",
        onClick: async () => {
          try {
            await fetch(`http://localhost:3000/sessoes/${id}`, {
              method: "DELETE",
            });
            setSessoes(sessoes.filter((s) => s.id !== id));
            toast.success("Sessão excluída!");
          } catch (error) {
            toast.error("Falha ao excluir sessão.");
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

  const getNomeFilme = (id: string) =>
    filmes.find((f) => f.id === id)?.titulo || "Desconhecido";
  const getNumeroSala = (id: string) =>
    salas.find((s) => s.id === id)?.numero || "?";

  return (
    <div className="container">
      <h2>Agendar Sessão</h2>
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Filme</label>
            <select
              className={`form-select ${errors.filmeId ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({ ...formData, filmeId: e.target.value })
              }
            >
              <option value="">Selecione...</option>
              {filmes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titulo}
                </option>
              ))}
            </select>
            {errors.filmeId && (
              <div className="invalid-feedback">{errors.filmeId}</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Sala</label>
            <select
              className={`form-select ${errors.salaId ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({ ...formData, salaId: e.target.value })
              }
            >
              <option value="">Selecione...</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  Sala {s.numero}
                </option>
              ))}
            </select>
            {errors.salaId && (
              <div className="invalid-feedback">{errors.salaId}</div>
            )}
          </div>
          <div className="col-md-4">
            <label className="form-label">Data e Hora</label>
            <input
              type="datetime-local"
              className={`form-control ${errors.dataHora ? "is-invalid" : ""}`}
              onChange={(e) =>
                setFormData({ ...formData, dataHora: e.target.value })
              }
            />
            {errors.dataHora && (
              <div className="invalid-feedback">{errors.dataHora}</div>
            )}
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Agendar
            </button>
          </div>
        </div>
      </form>

      <h3>Sessões Agendadas</h3>
      <div className="row">
        {sessoes.map((sessao) => (
          <div key={sessao.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{getNomeFilme(sessao.filmeId)}</h5>
                <h6 className="card-subtitle mb-2 text-primary">
                  Sala: {getNumeroSala(sessao.salaId)}
                </h6>
                <p className="card-text">
                  Data: {new Date(sessao.dataHora).toLocaleString()}
                </p>
                <div>
                  <button
                    onClick={() => venderIngresso(sessao.id)}
                    className="btn btn-success"
                  >
                    <i className="bi bi-ticket-perforated"></i> Vender Ingresso
                  </button>
                  <button
                    onClick={() => handleDelete(sessao.id)}
                    className="btn btn-danger btn-sm ms-2"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
