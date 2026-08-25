export type CategoryTree = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children: CategoryTree[];
};
