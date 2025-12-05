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
        filmeId: Number(dados.filmeId),
        salaId: Number(dados.salaId),
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

  const venderIngresso = async (sessaoId: number) => {
    const tipo = prompt(
      "Tipo do ingresso:\n1 - Inteira (R$ 20)\n2 - Meia (R$ 10)",
    );
    if (tipo === "1" || tipo === "2") {
      const valor = tipo === "1" ? 20 : 10;
      try {
        await fetch("http://localhost:3000/ingressos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessaoId,
            tipo: tipo === "1" ? "Inteira" : "Meia",
            valor,
          }),
        });
        toast.success(`Ingresso vendido! Valor: R$ ${valor.toFixed(2)}`);
      } catch (error) {
        toast.error("Falha ao vender ingresso. Tente novamente.");
        console.error(error);
      }
    }
  };

  const getNomeFilme = (id: number) =>
    filmes.find((f) => f.id === id)?.titulo || "Desconhecido";
  const getNumeroSala = (id: number) =>
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
                <h6 className="card-subtitle mb-2 text-muted">
                  Sala: {getNumeroSala(sessao.salaId)}
                </h6>
                <p className="card-text">
                  Data: {new Date(sessao.dataHora).toLocaleString()}
                </p>
                <button
                  onClick={() => venderIngresso(sessao.id)}
                  className="btn btn-success"
                >
                  <i className="bi bi-ticket-perforated"></i> Vender Ingresso
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
