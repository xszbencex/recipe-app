import { FormEvent, ReactNode, useMemo, useState } from "react";

type Difficulty = "easy" | "medium" | "hard";

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  createdAt?: Date;
}

type IconName =
  | "book"
  | "close"
  | "edit"
  | "grid"
  | "plus"
  | "search"
  | "spark"
  | "trash"
  | "users";

const photos = {
  table:
    "https://images.unsplash.com/photo-1545216560-68430ad77342?auto=format&fit=crop&w=1200&q=85",
  tomato:
    "https://images.unsplash.com/photo-1619865259873-5129c88d3122?auto=format&fit=crop&w=1200&q=85",
  salad:
    "https://images.unsplash.com/photo-1615366105533-5b8f3255ea5d?auto=format&fit=crop&w=1200&q=85",
  spread:
    "https://images.unsplash.com/photo-1695835394238-d3367fa34b45?auto=format&fit=crop&w=1200&q=85",
};

const seedRecipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy tomato rigatoni",
    description:
      "A silky weeknight pasta with slow-cooked tomatoes, parmesan, and a touch of cream.",
    category: "Dinner",
    difficulty: "easy",
    ingredients: [
      "400g rigatoni",
      "2 cups crushed tomatoes",
      "½ cup heavy cream",
      "Parmesan",
      "Fresh basil",
    ],
    steps: [
      "Boil the pasta in well-salted water until al dente.",
      "Simmer tomatoes for 15 minutes, then stir in the cream.",
      "Toss with pasta, parmesan, and a splash of pasta water.",
      "Finish with fresh basil and cracked pepper.",
    ],
    imageUrl: photos.tomato,
    createdAt: new Date("2025-02-17"),
  },
  {
    id: "2",
    title: "Garden harvest bowl",
    description:
      "Crisp greens, roasted vegetables, grains, and a bright lemon-tahini dressing.",
    category: "Lunch",
    difficulty: "easy",
    ingredients: [
      "Mixed greens",
      "1 cup cooked farro",
      "Roasted vegetables",
      "Avocado",
      "Lemon tahini",
    ],
    steps: [
      "Arrange greens and farro in a wide bowl.",
      "Add roasted vegetables and sliced avocado.",
      "Drizzle generously with lemon tahini and serve.",
    ],
    imageUrl: photos.salad,
    createdAt: new Date("2025-02-12"),
  },
  {
    id: "3",
    title: "Sunday table shakshuka",
    description:
      "Eggs gently poached in a fragrant pepper and tomato sauce, made for sharing.",
    category: "Breakfast",
    difficulty: "medium",
    ingredients: [
      "6 eggs",
      "2 red peppers",
      "1 can tomatoes",
      "Cumin",
      "Crusty bread",
    ],
    steps: [
      "Sauté peppers with cumin until soft.",
      "Add tomatoes and simmer until thickened.",
      "Make six wells, crack in eggs, and cover until just set.",
      "Serve at the table with warm bread.",
    ],
    imageUrl: photos.table,
    createdAt: new Date("2025-02-02"),
  },
  {
    id: "4",
    title: "Golden mezze spread",
    description:
      "A generous collection of dips, toasted flatbread, herbs, and seasonal vegetables.",
    category: "Dinner",
    difficulty: "hard",
    ingredients: [
      "Hummus",
      "Labneh",
      "Flatbread",
      "Seasonal vegetables",
      "Fresh herbs",
    ],
    steps: [
      "Prepare dips and chill until serving.",
      "Roast and season the vegetables.",
      "Warm the flatbread and arrange everything on a large platter.",
    ],
    imageUrl: photos.spread,
    createdAt: new Date("2025-01-28"),
  },
];

const emptyRecipe: Omit<Recipe, "id"> = {
  title: "",
  description: "",
  category: "Dinner",
  difficulty: "easy",
  ingredients: [],
  steps: [],
  imageUrl: "",
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    grid: (
      <>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    spark: (
      <path d="m12 3-1.1 4.3A5 5 0 0 1 7.3 11L3 12l4.3 1.1a5 5 0 0 1 3.6 3.6L12 21l1.1-4.3a5 5 0 0 1 3.6-3.6L21 12l-4.3-1.1a5 5 0 0 1-3.6-3.6Z" />
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 15H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M16 4.4a4 4 0 0 1 0 7.2M18 15a6 6 0 0 1 3 5.2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

function RecipeForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Recipe;
  onCancel: () => void;
  onSubmit: (recipe: Omit<Recipe, "id">) => void;
}) {
  const [form, setForm] = useState({
    ...(initial ?? emptyRecipe),
    ingredientsText: initial?.ingredients.join("\n") ?? "",
    stepsText: initial?.steps.join("\n") ?? "",
  });

  function update(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      imageUrl: form.imageUrl?.trim(),
      ingredients: form.ingredientsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      steps: form.stepsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      createdAt: initial?.createdAt ?? new Date(),
    });
  }

  return (
    <form className="recipe-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="title">Recipe title</label>
        <input
          autoFocus
          id="title"
          onChange={(event) => update("title", event.target.value)}
          placeholder="e.g. Lemon herb roast chicken"
          required
          value={form.title}
        />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          onChange={(event) => update("description", event.target.value)}
          placeholder="What makes this recipe special?"
          required
          rows={3}
          value={form.description}
        />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            onChange={(event) => update("category", event.target.value)}
            value={form.category}
          >
            {["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"].map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            onChange={(event) => update("difficulty", event.target.value)}
            value={form.difficulty}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="imageUrl">
          Image URL <span>Optional</span>
        </label>
        <input
          id="imageUrl"
          onChange={(event) => update("imageUrl", event.target.value)}
          placeholder="https://images.example.com/recipe.jpg"
          type="url"
          value={form.imageUrl}
        />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            onChange={(event) => update("ingredientsText", event.target.value)}
            placeholder={"One ingredient per line\n2 lemons\nOlive oil"}
            required
            rows={5}
            value={form.ingredientsText}
          />
        </div>
        <div className="field">
          <label htmlFor="steps">Steps</label>
          <textarea
            id="steps"
            onChange={(event) => update("stepsText", event.target.value)}
            placeholder={"One step per line\nPreheat the oven\nPrepare the sauce"}
            required
            rows={5}
            value={form.stepsText}
          />
        </div>
      </div>
      <div className="modal-actions">
        <button className="button button-secondary" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="button button-primary" type="submit">
          {initial ? "Save changes" : "Add recipe"}
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState(seedRecipes);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);

  const categories = ["All", ...Array.from(new Set(recipes.map((recipe) => recipe.category)))];
  const filteredRecipes = useMemo(
    () =>
      recipes.filter((recipe) => {
        const searchable = `${recipe.title} ${recipe.description} ${recipe.category}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (category === "All" || recipe.category === category) &&
          (difficulty === "All" || recipe.difficulty === difficulty)
        );
      }),
    [recipes, query, category, difficulty],
  );

  function saveRecipe(recipe: Omit<Recipe, "id">) {
    if (formMode === "edit" && activeRecipe) {
      setRecipes((current) =>
        current.map((item) => (item.id === activeRecipe.id ? { ...recipe, id: item.id } : item)),
      );
    } else {
      setRecipes((current) => [{ ...recipe, id: crypto.randomUUID() }, ...current]);
    }
    setFormMode(null);
    setActiveRecipe(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setRecipes((current) => current.filter((recipe) => recipe.id !== deleteTarget.id));
    if (activeRecipe?.id === deleteTarget.id) setActiveRecipe(null);
    setDeleteTarget(null);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="book" size={20} />
          </span>
          <span>mise</span>
        </div>
        <nav aria-label="Primary navigation">
          <button className="nav-item active" type="button">
            <Icon name="grid" />
            My recipes
            <span className="nav-count">{recipes.length}</span>
          </button>
          <button className="nav-item" type="button">
            <Icon name="spark" />
            Inspiration
          </button>
          <button className="nav-item" type="button">
            <Icon name="users" />
            Shared with me
          </button>
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">This week</span>
          <strong>Try something new</strong>
          <p>Turn seasonal produce into a recipe worth keeping.</p>
          <button
            onClick={() => {
              setActiveRecipe(null);
              setFormMode("create");
            }}
            type="button"
          >
            Create a recipe <span>→</span>
          </button>
        </div>
        <div className="profile">
          <span className="avatar">AM</span>
          <span>
            <strong>Alex Morgan</strong>
            <small>Home cook</small>
          </span>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand brand">
            <span className="brand-mark">
              <Icon name="book" size={18} />
            </span>
            <span>mise</span>
          </div>
          <div className="search-wrap">
            <Icon name="search" />
            <input
              aria-label="Search recipes"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your recipes..."
              value={query}
            />
            <kbd>⌘ K</kbd>
          </div>
          <button
            className="button button-primary"
            onClick={() => {
              setActiveRecipe(null);
              setFormMode("create");
            }}
            type="button"
          >
            <Icon name="plus" />
            Add recipe
          </button>
        </header>

        <section className="content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Your kitchen archive</p>
              <h1>My recipes</h1>
              <p>A growing collection of meals you love to make.</p>
            </div>
            <div className="stat">
              <span>{recipes.length}</span>
              <small>recipes saved</small>
            </div>
          </div>

          <div className="filters">
            <div className="category-tabs" role="group" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  className={category === item ? "active" : ""}
                  key={item}
                  onClick={() => setCategory(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            <select
              aria-label="Filter by difficulty"
              onChange={(event) => setDifficulty(event.target.value)}
              value={difficulty}
            >
              <option>All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {filteredRecipes.length ? (
            <div className="recipe-grid">
              {filteredRecipes.map((recipe, index) => (
                <article className="recipe-card" key={recipe.id}>
                  <button
                    aria-label={`View ${recipe.title}`}
                    className="card-image"
                    onClick={() => setActiveRecipe(recipe)}
                    type="button"
                  >
                    {recipe.imageUrl ? (
                      <img alt="" src={recipe.imageUrl} />
                    ) : (
                      <span className="image-placeholder">
                        <Icon name="book" size={30} />
                      </span>
                    )}
                    <span className={`difficulty ${recipe.difficulty}`}>
                      {recipe.difficulty}
                    </span>
                    <span className="card-number">0{index + 1}</span>
                  </button>
                  <div className="card-body">
                    <span className="category">{recipe.category}</span>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    <div className="card-footer">
                      <span>
                        {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
                      </span>
                      <div className="card-actions">
                        <button
                          aria-label={`Edit ${recipe.title}`}
                          onClick={() => {
                            setActiveRecipe(recipe);
                            setFormMode("edit");
                          }}
                          type="button"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          aria-label={`Delete ${recipe.title}`}
                          className="delete"
                          onClick={() => setDeleteTarget(recipe)}
                          type="button"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span><Icon name="search" size={24} /></span>
              <h2>No recipes found</h2>
              <p>Try a different search or clear your filters.</p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setDifficulty("All");
                }}
                type="button"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      {formMode && (
        <div className="modal-backdrop" role="presentation">
          <div aria-labelledby="form-title" aria-modal="true" className="modal form-modal" role="dialog">
            <div className="modal-header">
              <div>
                <span className="eyebrow">{formMode === "edit" ? "Update recipe" : "New recipe"}</span>
                <h2 id="form-title">
                  {formMode === "edit" ? "Edit your recipe" : "Add to your collection"}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="icon-button"
                onClick={() => {
                  setFormMode(null);
                  setActiveRecipe(null);
                }}
                type="button"
              >
                <Icon name="close" />
              </button>
            </div>
            <RecipeForm
              initial={formMode === "edit" ? activeRecipe ?? undefined : undefined}
              onCancel={() => {
                setFormMode(null);
                setActiveRecipe(null);
              }}
              onSubmit={saveRecipe}
            />
          </div>
        </div>
      )}

      {activeRecipe && !formMode && (
        <div className="modal-backdrop" role="presentation">
          <div aria-labelledby="detail-title" aria-modal="true" className="modal detail-modal" role="dialog">
            <div className="detail-hero">
              {activeRecipe.imageUrl && <img alt="" src={activeRecipe.imageUrl} />}
              <button
                aria-label="Close"
                className="icon-button floating"
                onClick={() => setActiveRecipe(null)}
                type="button"
              >
                <Icon name="close" />
              </button>
              <div className="detail-title">
                <span>{activeRecipe.category} · {activeRecipe.difficulty}</span>
                <h2 id="detail-title">{activeRecipe.title}</h2>
              </div>
            </div>
            <div className="detail-content">
              <p className="detail-description">{activeRecipe.description}</p>
              <div className="detail-columns">
                <section>
                  <h3>Ingredients</h3>
                  <ul>
                    {activeRecipe.ingredients.map((ingredient) => (
                      <li key={ingredient}><span />{ingredient}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>Method</h3>
                  <ol>
                    {activeRecipe.steps.map((step, index) => (
                      <li key={step}><span>{index + 1}</span>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>
              <div className="modal-actions">
                <button
                  className="button button-danger"
                  onClick={() => setDeleteTarget(activeRecipe)}
                  type="button"
                >
                  <Icon name="trash" size={16} /> Delete
                </button>
                <button
                  className="button button-primary"
                  onClick={() => setFormMode("edit")}
                  type="button"
                >
                  <Icon name="edit" size={16} /> Edit recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-backdrop confirm-layer" role="presentation">
          <div aria-labelledby="delete-title" aria-modal="true" className="modal confirm-modal" role="alertdialog">
            <span className="danger-icon"><Icon name="trash" /></span>
            <h2 id="delete-title">Delete this recipe?</h2>
            <p>
              “{deleteTarget.title}” will be permanently removed from your collection.
            </p>
            <div className="modal-actions">
              <button className="button button-secondary" onClick={() => setDeleteTarget(null)} type="button">
                Keep recipe
              </button>
              <button className="button button-danger solid" onClick={confirmDelete} type="button">
                Delete recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
