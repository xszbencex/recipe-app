const INGREDIENT_SECTION_PREFIX = '- ';

export function isIngredientSection(ingredient: string): boolean {
  const trimmedIngredient = ingredient.trim();
  return (
    trimmedIngredient.startsWith(INGREDIENT_SECTION_PREFIX) &&
    trimmedIngredient.slice(INGREDIENT_SECTION_PREFIX.length).trim().length > 0
  );
}

export function getIngredientSectionTitle(ingredient: string): string {
  return ingredient.trim().slice(INGREDIENT_SECTION_PREFIX.length).trim();
}

export function countIngredients(ingredients: string[]): number {
  return ingredients.filter((ingredient) => !isIngredientSection(ingredient)).length;
}
