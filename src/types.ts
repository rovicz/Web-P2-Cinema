import { z } from "zod";

export const filmeSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  sinopse: z.string().min(10, "A sinopse deve ter no mínimo 10 caracteres"),
  classificacao: z.string().min(1, "Classificação é obrigatória"),
  duracao: z.number().min(1, "Duração deve ser maior que 0"),
  genero: z.string().min(1, "Gênero é obrigatório"),
  dataEstreia: z.string().min(1, "Data é obrigatória"),
});

export type Filme = z.infer<typeof filmeSchema> & { id: string };

export const salaSchema = z.object({
  numero: z.number().min(1, "Número da sala é obrigatório"),
  capacidade: z.number().min(1, "Capacidade deve ser maior que 0"),
});

export type Sala = z.infer<typeof salaSchema> & { id: string };

export const sessaoSchema = z.object({
  filmeId: z.string().min(1, "Selecione um filme"), // HTML Select retorna string
  salaId: z.string().min(1, "Selecione uma sala"),
  dataHora: z.string().refine((data) => new Date(data) >= new Date(), {
    message: "A data da sessão não pode ser retroativa",
  }),
});

export type Sessao = {
  id: string;
  filmeId: string;
  salaId: string;
  dataHora: string;
};

export const ingressoSchema = z.object({
  sessaoId: z.string().min(1, "Selecione uma sessão"),
  tipo: z.string().min(1, "Tipo de ingresso é obrigatório"),
  valor: z.number().min(0, "Valor não pode ser negativo"),
});

export type Ingresso = z.infer<typeof ingressoSchema> & { id: string };
