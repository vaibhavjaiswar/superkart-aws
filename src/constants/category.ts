enum Category {
  'electronics' = 'electronics',
  'fashion' = 'fashion',
  'home-appliances' = 'home-appliances',
}

enum CategoryLabel {
  'Electronics' = 'Electronics',
  'Fashion' = 'Fashion',
  'Home Appliances' = 'Home Appliances',
}

export type Categories = 'electronics' | 'fashion' | 'home-appliances'

export const CategoryMap = new Map<string, string>([
  [Category.electronics, CategoryLabel.Electronics],
  [Category.fashion, CategoryLabel.Fashion],
  [Category["home-appliances"], CategoryLabel["Home Appliances"]],
  [CategoryLabel.Electronics, Category.electronics],
  [CategoryLabel.Fashion, Category.fashion],
  [CategoryLabel["Home Appliances"], Category["home-appliances"]],
])

export const categoryOptions = [
  { label: 'Select an option', value: '' },
  { label: CategoryLabel.Electronics, value: Category.electronics },
  { label: CategoryLabel.Fashion, value: Category.fashion },
  { label: CategoryLabel["Home Appliances"], value: Category["home-appliances"] },
]