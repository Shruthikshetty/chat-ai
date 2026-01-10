// this contains the global state of the selected model
import { create } from "zustand";

type SelectedModelStore = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
};

const inititalState: SelectedModelStore = {
  selectedModel: "deepseek-r1:14b",
  setSelectedModel: () => {},
};

export const useSelecteModel = create<SelectedModelStore>((set) => ({
  ...inititalState,
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
