// this contains the global state of the selected model
import { Model } from "@/lib/types";
import { create } from "zustand";

type SelectedModelStore = {
  selectedModel?: Model;
  setSelectedModel: (model: Model) => void;
};

const inititalState: SelectedModelStore = {
  selectedModel: undefined,
  setSelectedModel: () => {},
};

export const useSelecteModel = create<SelectedModelStore>((set) => ({
  ...inititalState,
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
