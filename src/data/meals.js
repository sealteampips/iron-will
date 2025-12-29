// Nutrition Meal Database
// Categories: breakfast, lunch, dinner, snacks

export const MEALS = {
  breakfast: [
    {
      id: 1,
      name: "Classic Scramble + Chicken Sausage + Sourdough",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
      calories: 450,
      protein: "35g",
      cookTime: "15 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "3 large eggs",
        "2 chicken sausage patties (pre-cooked, like Aidells or Applegate)",
        "2 slices sourdough bread",
        "1 tbsp butter or olive oil",
        "Salt, pepper",
        "Everything bagel seasoning (optional)",
        "Hot sauce (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Heat the sausage (4-5 min)",
          detail: "Place chicken sausage patties in a skillet over medium heat. Cook 2-3 min per side until heated through and lightly browned on the outside. Set aside."
        },
        {
          step: 2,
          title: "Toast the bread (2-3 min)",
          detail: "While sausage cooks, toast sourdough slices until golden brown. Set aside."
        },
        {
          step: 3,
          title: "Scramble the eggs (3-4 min)",
          detail: "Crack eggs into a bowl, whisk until combined. Heat butter in the same skillet over medium-low heat. Pour in eggs, let sit 20 seconds, then gently push from edges to center with spatula. Repeat until eggs are soft and slightly wet — they'll finish cooking off heat."
        },
        {
          step: 4,
          title: "Season and serve",
          detail: "Season eggs with salt, pepper, and everything bagel seasoning if using. Plate with sausage and toast. Add hot sauce if desired."
        }
      ]
    },
    {
      id: 2,
      name: "Overnight Oats with Almond Butter & Berries",
      image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop",
      calories: 420,
      protein: "15g",
      cookTime: "5 min prep (night before)",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1/2 cup old-fashioned rolled oats (not instant)",
        "1/2 cup almond milk",
        "1/4 cup Greek yogurt",
        "1 tbsp almond butter",
        "1 tbsp honey or maple syrup",
        "1/2 cup mixed berries (fresh or frozen)",
        "1 tbsp chia seeds (optional)",
        "Pinch of salt"
      ],
      instructions: [
        {
          step: 1,
          title: "Combine base (2 min)",
          detail: "In a mason jar or container with lid, add oats, almond milk, Greek yogurt, chia seeds, honey, and salt. Stir until combined."
        },
        {
          step: 2,
          title: "Refrigerate overnight",
          detail: "Seal container and refrigerate at least 4 hours or overnight. Oats will absorb liquid and soften."
        },
        {
          step: 3,
          title: "Top and serve (morning)",
          detail: "Stir oats — if too thick, add splash of almond milk. Top with almond butter and berries. Eat cold or microwave 1-2 min if you prefer warm."
        }
      ],
      mealPrepNotes: "Make 4-5 jars on Sunday night. Keeps in fridge up to 5 days. Add fresh berries day-of for best texture."
    },
    {
      id: 3,
      name: "Breakfast Burrito",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
      calories: 520,
      protein: "32g",
      cookTime: "25 min (bulk)",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "8 large eggs",
        "1 lb ground turkey (93% lean — look for this on the label)",
        "1 bell pepper, diced (any color)",
        "1/2 yellow onion, diced",
        "4 large flour tortillas (burrito size, ~10 inch)",
        "2 avocados, sliced",
        "1 tbsp olive oil",
        "Salt, pepper, cumin, garlic powder",
        "Hot sauce (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the turkey (7-8 min)",
          detail: "Add olive oil to a large skillet over medium-high heat. Once the oil shimmers (about 30 sec), add ground turkey. Break it apart with a spatula. Cook until no pink remains and edges start to brown. Season with salt, pepper, 1 tsp cumin, 1/2 tsp garlic powder. Set aside in a bowl."
        },
        {
          step: 2,
          title: "Sauté the veggies (5 min)",
          detail: "Same skillet, add bell pepper and onion. Stir occasionally until onion turns translucent and peppers soften. They should bend easily, not be crunchy."
        },
        {
          step: 3,
          title: "Scramble the eggs (3-4 min)",
          detail: "Crack eggs into a bowl, whisk until yolks and whites are fully combined. Heat a separate pan on medium-low with a little olive oil. Pour in eggs, let them sit for 20 seconds, then gently push from edges to center with a spatula. Repeat until eggs are soft and slightly wet — they'll finish cooking off the heat. Don't overcook."
        },
        {
          step: 4,
          title: "Assemble",
          detail: "Lay tortilla flat. Add a line of eggs down the center, top with turkey, veggies, and avocado slices. Fold the sides in, then roll from the bottom up tightly."
        },
        {
          step: 5,
          title: "Meal prep storage",
          detail: "Wrap each burrito in foil. Fridge up to 5 days. Reheat in microwave (90 sec, flip halfway) or air fryer (5 min at 350°F for crispy tortilla)."
        }
      ],
      mealPrepNotes: "Makes 4 burritos. Don't add avocado if meal prepping — it browns. Add fresh avocado after reheating."
    },
    {
      id: 4,
      name: "Greek Yogurt Parfait",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      calories: 380,
      protein: "22g",
      cookTime: "5 min",
      tag: "Rest Day",
      mealPrep: false,
      ingredients: [
        "1 cup Greek yogurt (plain or vanilla, non-dairy if preferred)",
        "1/2 cup granola",
        "1/2 cup mixed berries (strawberries, blueberries)",
        "1 tbsp honey",
        "1 tbsp sliced almonds (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Layer the parfait",
          detail: "In a bowl or glass, add half the yogurt, then half the granola and berries. Repeat layers."
        },
        {
          step: 2,
          title: "Top and serve",
          detail: "Drizzle honey on top. Add sliced almonds if using. Eat immediately — granola gets soggy if it sits."
        }
      ]
    },
    {
      id: 5,
      name: "Avocado Toast + Fried Eggs",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
      calories: 450,
      protein: "20g",
      cookTime: "10 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "2 slices sourdough bread",
        "1 ripe avocado",
        "2 large eggs",
        "1 tbsp olive oil or butter",
        "Salt, pepper",
        "Everything bagel seasoning",
        "Red pepper flakes (optional)",
        "Squeeze of lemon or lime (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Toast the bread (2-3 min)",
          detail: "Toast sourdough until golden and crispy. You want it sturdy enough to hold the avocado."
        },
        {
          step: 2,
          title: "Prep the avocado (2 min)",
          detail: "Cut avocado in half, remove pit, scoop flesh into a bowl. Mash with fork to desired texture — chunky or smooth. Season with salt, pepper, and lemon if using."
        },
        {
          step: 3,
          title: "Fry the eggs (3-4 min)",
          detail: "Heat olive oil in a non-stick pan over medium heat. Crack eggs into pan. Let cook undisturbed until whites are set and edges are slightly crispy, but yolk is still runny — about 3 min. For over-easy, flip and cook 30 more seconds."
        },
        {
          step: 4,
          title: "Assemble",
          detail: "Spread mashed avocado on toast. Top each slice with a fried egg. Season with everything bagel seasoning and red pepper flakes if using."
        }
      ]
    },
    {
      id: 6,
      name: "Oatmeal Power Bowl",
      image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=300&fit=crop",
      calories: 480,
      protein: "14g",
      cookTime: "10 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1 cup old-fashioned rolled oats",
        "2 cups water or almond milk",
        "1 banana, sliced",
        "2 tbsp almond butter",
        "1 tbsp dark chocolate chips",
        "1 tbsp honey",
        "Pinch of salt",
        "Cinnamon (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the oats (5-7 min)",
          detail: "Bring water or almond milk to a boil in a small pot. Add oats and pinch of salt. Reduce heat to medium-low. Stir occasionally until oats absorb most liquid and reach creamy consistency — about 5 min. Oats are done when they're soft but not mushy."
        },
        {
          step: 2,
          title: "Build the bowl",
          detail: "Transfer oats to a bowl. Top with sliced banana, almond butter, dark chocolate chips, and honey. Sprinkle cinnamon if using."
        }
      ]
    },
    {
      id: 7,
      name: "Steak & Eggs + Sweet Potato Hash",
      image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop",
      calories: 550,
      protein: "42g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "6 oz sirloin steak (or ribeye if you want more fat)",
        "2 large eggs",
        "1 medium sweet potato, diced into 1/2 inch cubes",
        "1/2 yellow onion, diced",
        "2 tbsp olive oil, divided",
        "Salt, pepper",
        "Garlic powder",
        "Paprika",
        "Fresh rosemary (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Start the hash (12-15 min)",
          detail: "Heat 1 tbsp olive oil in a large skillet over medium heat. Add sweet potato cubes in a single layer. Let cook without stirring for 3-4 min to get a sear. Flip, add onions, season with salt, pepper, garlic powder, paprika. Cook 8-10 more min, stirring occasionally, until potatoes are fork-tender and slightly crispy."
        },
        {
          step: 2,
          title: "Cook the steak (6-10 min)",
          detail: "While hash cooks, heat another skillet (cast iron preferred) over high heat until smoking. Pat steak dry, season generously with salt and pepper on both sides. Add 1 tbsp oil to pan, then steak. Don't touch it for 3-4 min to build a crust. Flip, cook 3-4 more min for medium-rare (internal temp 130°F). Rest steak 5 min before slicing — this keeps it juicy."
        },
        {
          step: 3,
          title: "Fry the eggs (3-4 min)",
          detail: "In the steak pan (use the leftover fat), crack eggs. Cook until whites are set, yolk still runny."
        },
        {
          step: 4,
          title: "Plate",
          detail: "Slice steak against the grain. Serve with hash and fried eggs on top."
        }
      ]
    },
    {
      id: 8,
      name: "Breakfast Rice Bowl",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      calories: 510,
      protein: "28g",
      cookTime: "15 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 cup cooked white rice (leftover or instant)",
        "2 large eggs",
        "2 chicken sausage patties, sliced",
        "1/2 avocado, sliced",
        "1 tbsp olive oil",
        "Salt, pepper",
        "Hot sauce (Cholula, Tapatio, Sriracha)",
        "Sesame seeds (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Heat the rice (2-3 min)",
          detail: "If using leftover rice, microwave with a splash of water for 1-2 min to rehydrate. If cooking fresh, follow package directions."
        },
        {
          step: 2,
          title: "Cook sausage (4-5 min)",
          detail: "Slice chicken sausage into rounds. Heat in a skillet over medium heat until warmed through and slightly browned — about 2 min per side."
        },
        {
          step: 3,
          title: "Fry the eggs (3-4 min)",
          detail: "Add olive oil to pan. Crack eggs in, cook until whites are set and edges crispy, yolk still runny."
        },
        {
          step: 4,
          title: "Assemble the bowl",
          detail: "Add rice to bowl, top with sausage slices, fried eggs, and avocado. Hit with hot sauce and sesame seeds if using."
        }
      ],
      mealPrepNotes: "Batch cook rice and sausage. Store separately. Fry eggs fresh each morning. Add avocado day-of."
    },
    {
      id: 9,
      name: "Banana Protein Pancakes",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      calories: 420,
      protein: "32g",
      cookTime: "15 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1 ripe banana",
        "2 large eggs",
        "1/2 cup old-fashioned oats",
        "1 scoop protein powder (Legion or preferred brand)",
        "1/4 tsp baking powder",
        "1/2 tsp cinnamon",
        "Butter or coconut oil for pan",
        "Toppings: almond butter, berries, honey"
      ],
      instructions: [
        {
          step: 1,
          title: "Make the batter (3 min)",
          detail: "Add banana, eggs, oats, protein powder, baking powder, and cinnamon to a blender. Blend until smooth — about 30 seconds. Batter should be pourable but thick."
        },
        {
          step: 2,
          title: "Heat the pan",
          detail: "Heat a non-stick pan or griddle over medium-low heat. Add a small amount of butter. Pan is ready when a drop of water sizzles and evaporates."
        },
        {
          step: 3,
          title: "Cook pancakes (2-3 min per side)",
          detail: "Pour about 1/4 cup batter per pancake. Cook until bubbles form on surface and edges look set — about 2 min. Flip gently (these are more delicate than regular pancakes). Cook another 1-2 min until golden."
        },
        {
          step: 4,
          title: "Serve",
          detail: "Stack pancakes, top with almond butter, fresh berries, and drizzle of honey."
        }
      ]
    },
    {
      id: 10,
      name: "Fruit & Nut Bowl",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop",
      calories: 400,
      protein: "18g",
      cookTime: "5 min",
      tag: "Rest Day",
      mealPrep: false,
      ingredients: [
        "1 cup Greek yogurt",
        "1/4 cup mixed nuts (almonds, cashews, walnuts)",
        "1 banana, sliced",
        "1/4 cup granola",
        "1/2 cup mixed berries",
        "1 tbsp honey",
        "1 tbsp chia seeds (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Build the bowl",
          detail: "Add Greek yogurt to a bowl. Arrange banana slices, berries, nuts, and granola on top in sections."
        },
        {
          step: 2,
          title: "Finish",
          detail: "Drizzle honey over everything. Sprinkle chia seeds if using. Eat immediately for best crunch."
        }
      ]
    }
  ],
  lunch: [
    {
      id: 1,
      name: "Chicken Rice Bowl",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      calories: 580,
      protein: "42g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1 lb chicken thighs (boneless, skinless)",
        "2 cups cooked white rice",
        "1 bell pepper, sliced",
        "1/2 yellow onion, sliced",
        "1 avocado, sliced",
        "2 tbsp olive oil, divided",
        "Salt, pepper, cumin, garlic powder, paprika",
        "Lime juice",
        "Fresh cilantro (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Season and cook chicken (12-15 min)",
          detail: "Pat chicken thighs dry. Season both sides with salt, pepper, cumin, garlic powder, paprika. Heat 1 tbsp olive oil in a skillet over medium-high heat. Add chicken, cook 5-6 min per side until internal temp reaches 165°F and outside is golden brown. Let rest 5 min, then slice."
        },
        {
          step: 2,
          title: "Sauté the veggies (5 min)",
          detail: "In the same pan, add remaining oil. Add sliced peppers and onions. Cook until slightly charred and softened."
        },
        {
          step: 3,
          title: "Assemble the bowl",
          detail: "Add rice to bowl. Top with sliced chicken, peppers, onions, and avocado. Squeeze lime juice over top. Garnish with cilantro if using."
        }
      ],
      mealPrepNotes: "Cook chicken and veggies in bulk. Store rice separately. Portion into containers. Add avocado fresh each day."
    },
    {
      id: 2,
      name: "Turkey Tacos",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
      calories: 480,
      protein: "35g",
      cookTime: "20 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb ground turkey (93% lean)",
        "8 corn tortillas (street taco size)",
        "2 tomatoes, diced",
        "1 avocado, diced",
        "1/2 yellow onion, diced",
        "1 tbsp olive oil",
        "Salt, pepper, cumin, chili powder, garlic powder",
        "Fresh cilantro",
        "Lime wedges",
        "Hot sauce (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the turkey (7-8 min)",
          detail: "Heat oil in skillet over medium-high heat. Add turkey, break apart with spatula. Cook until no pink remains. Season with salt, pepper, 1 tsp cumin, 1 tsp chili powder, 1/2 tsp garlic powder. Stir to combine."
        },
        {
          step: 2,
          title: "Warm the tortillas (2 min)",
          detail: "Heat tortillas directly on a gas burner for 20-30 sec per side until slightly charred. Or heat in a dry pan over high heat. Stack and cover with towel to keep warm."
        },
        {
          step: 3,
          title: "Prep the toppings",
          detail: "While turkey cooks, dice tomatoes, avocado, and onion. Chop cilantro, cut lime into wedges."
        },
        {
          step: 4,
          title: "Assemble tacos",
          detail: "Double up tortillas (2 per taco for sturdiness). Add turkey, top with tomato, avocado, onion, cilantro. Squeeze lime, add hot sauce if desired."
        }
      ],
      mealPrepNotes: "Store cooked turkey in container. Prep toppings separately. Warm tortillas fresh when eating."
    },
    {
      id: 3,
      name: "Steak Burrito Bowl",
      image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400&h=300&fit=crop",
      calories: 620,
      protein: "38g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1 lb ground beef (85/15 lean-to-fat ratio)",
        "2 cups cooked white rice",
        "1 bell pepper, sliced",
        "1/2 yellow onion, sliced",
        "1 avocado, sliced",
        "1 tbsp olive oil",
        "Salt, pepper, cumin, chili powder, garlic powder",
        "Salsa or pico de gallo",
        "Sour cream or Greek yogurt (optional)",
        "Lime juice"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the beef (8-10 min)",
          detail: "Heat oil in skillet over medium-high heat. Add ground beef, break apart. Cook until browned and slightly crispy on edges. Drain excess fat if needed. Season with salt, pepper, cumin, chili powder, garlic powder."
        },
        {
          step: 2,
          title: "Sauté veggies (5 min)",
          detail: "In same pan or separate skillet, cook bell pepper and onion until slightly charred and softened."
        },
        {
          step: 3,
          title: "Assemble the bowl",
          detail: "Add rice to bowl. Top with beef, peppers, onions, avocado, salsa. Add dollop of Greek yogurt if using. Squeeze lime over top."
        }
      ],
      mealPrepNotes: "Make big batches of rice, beef, and veggies. Store separately. Assemble fresh with avocado each day."
    },
    {
      id: 4,
      name: "Chicken Caesar Wrap",
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
      calories: 450,
      protein: "38g",
      cookTime: "15 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb chicken breast",
        "4 large flour tortillas",
        "1 head romaine lettuce, chopped",
        "1 cup cherry tomatoes, halved",
        "1 cucumber, sliced",
        "Caesar dressing (store-bought or homemade)",
        "Salt, pepper, garlic powder",
        "1 tbsp olive oil"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the chicken (12-14 min)",
          detail: "Slice chicken breast in half horizontally to create thinner cutlets (cooks faster and more evenly). Season with salt, pepper, garlic powder. Heat oil in skillet over medium-high heat. Cook 5-6 min per side until internal temp hits 165°F. Rest 3 min, then slice into strips."
        },
        {
          step: 2,
          title: "Prep the veggies",
          detail: "Chop romaine, halve tomatoes, slice cucumber."
        },
        {
          step: 3,
          title: "Assemble the wrap",
          detail: "Lay tortilla flat. Add romaine down the center, top with chicken strips, tomatoes, cucumber. Drizzle with Caesar dressing. Fold sides in, roll from bottom up tightly."
        }
      ],
      mealPrepNotes: "Cook chicken in bulk. Store sliced in containers. Prep veggies, store separately. Assemble wraps fresh to avoid soggy tortilla."
    },
    {
      id: 5,
      name: "Salmon + Asparagus + Sweet Potato",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      calories: 520,
      protein: "36g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "6 oz salmon fillet (skin-on or skinless)",
        "1 bunch asparagus, ends trimmed",
        "1 medium sweet potato, cubed",
        "2 tbsp olive oil, divided",
        "Salt, pepper",
        "Garlic powder",
        "Lemon",
        "Fresh dill or parsley (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Roast sweet potato (20-25 min)",
          detail: "Preheat oven to 425°F. Toss sweet potato cubes with 1 tbsp oil, salt, pepper, garlic powder. Spread on baking sheet in single layer. Roast 20-25 min, flipping halfway, until fork-tender and edges are crispy."
        },
        {
          step: 2,
          title: "Cook asparagus (10 min)",
          detail: "Add asparagus to the same baking sheet for the last 10 min of sweet potato cook time. Drizzle with oil, season with salt and pepper."
        },
        {
          step: 3,
          title: "Pan-sear salmon (6-8 min)",
          detail: "Pat salmon dry. Season with salt and pepper. Heat remaining oil in oven-safe skillet over medium-high heat. Place salmon skin-side up (flesh-side down first). Cook 3-4 min until golden crust forms. Flip, cook another 3-4 min until internal temp reaches 125°F for medium. Don't overcook — salmon continues cooking off heat."
        },
        {
          step: 4,
          title: "Plate",
          detail: "Serve salmon with sweet potato and asparagus. Squeeze lemon over salmon. Garnish with dill if using."
        }
      ]
    },
    {
      id: 6,
      name: "Loaded Baked Potato",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      calories: 540,
      protein: "32g",
      cookTime: "30 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1 large russet potato",
        "1/2 lb ground turkey (93% lean)",
        "1/2 avocado, diced",
        "2 green onions, sliced",
        "2 tbsp Greek yogurt (sour cream substitute)",
        "1 tbsp olive oil",
        "Salt, pepper, garlic powder, paprika",
        "Hot sauce (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Bake the potato (25-30 min)",
          detail: "Poke potato several times with fork. Microwave for 5 min, flip, microwave another 5 min. For crispier skin, transfer to 425°F oven for 10-15 min. Potato is done when a knife slides in easily."
        },
        {
          step: 2,
          title: "Cook the turkey (7-8 min)",
          detail: "While potato cooks, heat oil in skillet over medium-high. Add turkey, break apart. Season with salt, pepper, garlic powder, paprika. Cook until browned."
        },
        {
          step: 3,
          title: "Load the potato",
          detail: "Slice potato open, fluff inside with fork. Add turkey, diced avocado, Greek yogurt, green onions. Season with salt, pepper, hot sauce if using."
        }
      ]
    },
    {
      id: 7,
      name: "Chicken Quesadilla",
      image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop",
      calories: 510,
      protein: "40g",
      cookTime: "15 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb chicken breast, sliced thin",
        "4 large flour tortillas",
        "1 cup shredded cheese (Mexican blend or cheddar — skip or use dairy-free if needed)",
        "1 bell pepper, sliced",
        "1/2 yellow onion, sliced",
        "2 tbsp olive oil, divided",
        "Salt, pepper, cumin, chili powder",
        "Salsa and guacamole for serving"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook chicken and veggies (10-12 min)",
          detail: "Slice chicken breast into thin strips. Season with salt, pepper, cumin, chili powder. Heat 1 tbsp oil in skillet over medium-high. Cook chicken 4-5 min per side until cooked through. Remove. Add peppers and onions to same pan, cook 4-5 min until softened."
        },
        {
          step: 2,
          title: "Assemble quesadilla",
          detail: "Lay tortilla flat. On one half, layer cheese, chicken, peppers and onions, more cheese. Fold tortilla in half."
        },
        {
          step: 3,
          title: "Cook quesadilla (3-4 min)",
          detail: "Heat clean skillet over medium heat with a little oil or butter. Add quesadilla, cook 2 min per side until tortilla is golden and cheese is melted. Press down gently with spatula while cooking."
        },
        {
          step: 4,
          title: "Serve",
          detail: "Cut into triangles. Serve with salsa and guacamole on the side."
        }
      ],
      mealPrepNotes: "Cook chicken and veggies in bulk. Store separately. Assemble and cook quesadillas fresh."
    },
    {
      id: 8,
      name: "Mediterranean Plate",
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
      calories: 490,
      protein: "35g",
      cookTime: "20 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb chicken breast",
        "1/2 cup hummus",
        "1 cucumber, sliced",
        "1 cup cherry tomatoes, halved",
        "1/4 red onion, sliced thin",
        "1 cup cooked white rice (or pita bread)",
        "2 tbsp olive oil",
        "Salt, pepper, oregano, garlic powder, paprika",
        "Lemon juice",
        "Fresh parsley (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Marinate and cook chicken (15-18 min)",
          detail: "Slice chicken into strips or cubes. Toss with olive oil, salt, pepper, oregano, garlic powder, paprika. Let sit 5 min if time allows. Heat skillet over medium-high. Cook chicken 5-6 min per side until golden and internal temp reaches 165°F."
        },
        {
          step: 2,
          title: "Prep the plate",
          detail: "Slice cucumber, halve tomatoes, slice red onion thin."
        },
        {
          step: 3,
          title: "Assemble",
          detail: "Add rice to plate. Arrange chicken, hummus, cucumber, tomatoes, and onion around the rice. Drizzle olive oil and lemon juice over veggies. Garnish with parsley if using."
        }
      ],
      mealPrepNotes: "Cook chicken in bulk. Prep veggies separately. Portion hummus into small containers. Assemble plates fresh."
    },
    {
      id: 9,
      name: "Teriyaki Chicken + White Rice + Green Beans",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      calories: 550,
      protein: "40g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1 lb chicken thighs (boneless, skinless)",
        "2 cups cooked white rice",
        "1 lb green beans, ends trimmed",
        "1/2 cup teriyaki sauce (store-bought is fine — look for low sodium)",
        "1 tbsp olive oil",
        "2 tbsp sesame seeds",
        "2 green onions, sliced",
        "Salt, pepper"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the chicken (12-15 min)",
          detail: "Pat chicken dry, season with salt and pepper. Heat oil in skillet over medium-high heat. Cook thighs 5-6 min per side until internal temp reaches 165°F. In the last 2 min, pour teriyaki sauce over chicken. Let it coat and caramelize. Remove, slice."
        },
        {
          step: 2,
          title: "Cook green beans (6-8 min)",
          detail: "In same pan or separate skillet, add green beans with a splash of water. Cover and steam 4-5 min. Remove lid, let water evaporate, then add a little oil. Sauté 2-3 min until slightly charred. Season with salt."
        },
        {
          step: 3,
          title: "Assemble",
          detail: "Add rice to bowl or plate. Top with sliced chicken and green beans. Drizzle any remaining teriyaki from the pan. Top with sesame seeds and green onions."
        }
      ],
      mealPrepNotes: "This is a perfect meal prep meal. Cook everything in bulk, portion into containers. Reheats well in microwave 2 min."
    },
    {
      id: 10,
      name: "Beef & Cheese Quesadilla",
      image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=300&fit=crop",
      calories: 560,
      protein: "36g",
      cookTime: "15 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1/2 lb ground beef (85/15)",
        "2 large flour tortillas",
        "1 cup shredded cheese (Mexican blend or cheddar)",
        "1 bell pepper, diced",
        "1/2 yellow onion, diced",
        "1/2 avocado, sliced (for serving)",
        "1 tbsp olive oil",
        "Salt, pepper, cumin, chili powder",
        "Salsa for serving"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook the beef and veggies (8-10 min)",
          detail: "Heat oil in skillet over medium-high. Add ground beef, break apart. Cook until browned. Add bell pepper and onion, cook another 3-4 min until softened. Season with salt, pepper, cumin, chili powder. Drain excess fat if needed."
        },
        {
          step: 2,
          title: "Assemble quesadilla",
          detail: "On one tortilla, layer cheese, then beef and veggie mixture, then more cheese. Top with second tortilla."
        },
        {
          step: 3,
          title: "Cook quesadilla (4-5 min)",
          detail: "Heat clean skillet over medium heat. Add quesadilla, cook 2-3 min until bottom tortilla is golden. Carefully flip (use a plate to help if needed). Cook another 2 min until both sides golden and cheese is melted."
        },
        {
          step: 4,
          title: "Serve",
          detail: "Cut into quarters. Serve with sliced avocado and salsa on the side."
        }
      ],
      mealPrepNotes: "Cook beef and veggie mixture in bulk. Assemble and cook quesadillas fresh for best texture."
    }
  ],
  dinner: [
    {
      id: 1,
      name: "Grilled Steak + Brussels Sprouts + Mashed Potatoes",
      image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop",
      calories: 650,
      protein: "45g",
      cookTime: "30 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "8 oz ribeye or sirloin steak",
        "1 lb Brussels sprouts, halved",
        "2 medium russet potatoes, peeled and cubed",
        "2 tbsp butter",
        "3 tbsp olive oil, divided",
        "1/4 cup almond milk",
        "Salt, pepper, garlic powder",
        "Fresh rosemary or thyme (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Boil potatoes (15-18 min)",
          detail: "Add cubed potatoes to pot of salted water. Bring to boil, then reduce to simmer. Cook until fork-tender — a knife should slide in with no resistance. Drain, return to pot."
        },
        {
          step: 2,
          title: "Roast Brussels sprouts (20-25 min)",
          detail: "While potatoes boil, preheat oven to 425°F. Toss halved Brussels sprouts with 2 tbsp olive oil, salt, pepper. Spread on baking sheet cut-side down. Roast 20-25 min until edges are crispy and browned."
        },
        {
          step: 3,
          title: "Cook the steak (8-12 min)",
          detail: "Pat steak dry, season generously with salt and pepper. Heat remaining oil in cast iron or skillet over high heat until smoking. Add steak — don't touch it for 4-5 min to build crust. Flip, cook another 4-5 min for medium. Add butter and rosemary to pan, baste steak. Rest 5 min before slicing."
        },
        {
          step: 4,
          title: "Mash the potatoes",
          detail: "Add butter and almond milk to drained potatoes. Mash until smooth. Season with salt, pepper, garlic powder."
        },
        {
          step: 5,
          title: "Plate",
          detail: "Slice steak against the grain. Serve with mashed potatoes and Brussels sprouts."
        }
      ]
    },
    {
      id: 2,
      name: "Chicken Fajitas",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
      calories: 580,
      protein: "42g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1.5 lbs chicken thighs, sliced into strips",
        "2 bell peppers (mixed colors), sliced",
        "1 yellow onion, sliced",
        "8 flour tortillas",
        "1 avocado, sliced",
        "3 tbsp olive oil, divided",
        "Salt, pepper, cumin, chili powder, paprika, garlic powder",
        "Lime wedges",
        "Fresh cilantro",
        "Salsa and sour cream for serving"
      ],
      instructions: [
        {
          step: 1,
          title: "Season the chicken (2 min)",
          detail: "Slice chicken into thin strips. Toss with 1 tbsp oil, salt, pepper, 1 tsp each cumin, chili powder, paprika, 1/2 tsp garlic powder."
        },
        {
          step: 2,
          title: "Cook chicken (8-10 min)",
          detail: "Heat large skillet (or cast iron) over high heat. Add chicken in a single layer — don't crowd the pan, cook in batches if needed. Let cook undisturbed 3-4 min to get a char. Stir, cook another 3-4 min until cooked through. Remove to plate."
        },
        {
          step: 3,
          title: "Cook peppers and onions (6-8 min)",
          detail: "Same pan, add remaining oil. Add peppers and onions. Cook over high heat, stirring occasionally, until charred and slightly softened but still have some crunch — about 6-8 min. Season with salt and pepper."
        },
        {
          step: 4,
          title: "Warm tortillas",
          detail: "Heat tortillas directly over gas flame 20-30 sec per side, or in a dry pan over high heat. Stack and cover with towel."
        },
        {
          step: 5,
          title: "Serve family style",
          detail: "Combine chicken and veggies in the skillet. Serve with warm tortillas, sliced avocado, lime wedges, cilantro, salsa, and sour cream."
        }
      ],
      mealPrepNotes: "Cook chicken and veggies in bulk. Reheat in skillet to maintain some char. Warm tortillas fresh."
    },
    {
      id: 3,
      name: "Salmon + Asparagus + White Rice",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      calories: 540,
      protein: "38g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "6 oz salmon fillet",
        "1 bunch asparagus, ends trimmed",
        "1 cup cooked white rice",
        "2 tbsp olive oil, divided",
        "2 tbsp soy sauce or coconut aminos",
        "1 tbsp honey",
        "Salt, pepper",
        "Sesame seeds",
        "Lemon wedges"
      ],
      instructions: [
        {
          step: 1,
          title: "Make the glaze (1 min)",
          detail: "Mix soy sauce and honey in a small bowl. Set aside."
        },
        {
          step: 2,
          title: "Cook rice",
          detail: "If not using leftover rice, cook according to package directions."
        },
        {
          step: 3,
          title: "Roast or sauté asparagus (8-10 min)",
          detail: "Toss asparagus with 1 tbsp oil, salt, pepper. Roast at 400°F for 10 min, or sauté in skillet over medium-high heat 5-6 min until tender-crisp."
        },
        {
          step: 4,
          title: "Cook salmon (8-10 min)",
          detail: "Pat salmon dry, season with salt and pepper. Heat remaining oil in skillet over medium-high heat. Place salmon flesh-side down first. Cook 4 min until golden crust forms. Flip, brush with honey-soy glaze. Cook another 4 min until internal temp reaches 125°F for medium."
        },
        {
          step: 5,
          title: "Plate",
          detail: "Serve salmon over rice with asparagus on the side. Drizzle remaining glaze, sprinkle sesame seeds, serve with lemon wedge."
        }
      ]
    },
    {
      id: 4,
      name: "Spaghetti + Ground Beef Meat Sauce",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
      calories: 620,
      protein: "38g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: true,
      ingredients: [
        "1 lb ground beef (85/15)",
        "8 oz spaghetti (or preferred pasta)",
        "24 oz marinara sauce (jar is fine — look for low sugar)",
        "1/2 yellow onion, diced",
        "3 cloves garlic, minced",
        "1 tbsp olive oil",
        "Salt, pepper, Italian seasoning",
        "Fresh basil (optional)",
        "Parmesan cheese (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Boil pasta (10-12 min)",
          detail: "Bring large pot of salted water to boil. Add pasta, cook according to package directions until al dente (should have slight bite). Reserve 1/2 cup pasta water before draining."
        },
        {
          step: 2,
          title: "Build the meat sauce (12-15 min)",
          detail: "While pasta cooks, heat oil in large skillet over medium-high. Add diced onion, cook 3-4 min until softened. Add garlic, cook 30 seconds until fragrant. Add ground beef, break apart, cook until browned — about 6-8 min. Drain excess fat if needed."
        },
        {
          step: 3,
          title: "Simmer the sauce (5 min)",
          detail: "Add marinara sauce to the beef. Season with salt, pepper, 1 tsp Italian seasoning. Simmer 5 min to let flavors combine. If sauce is too thick, add some reserved pasta water."
        },
        {
          step: 4,
          title: "Combine and serve",
          detail: "Add drained pasta directly to the sauce. Toss to coat. Serve in bowls, top with fresh basil and parmesan if using."
        }
      ],
      mealPrepNotes: "Make a double batch of meat sauce. Portion into containers. Cook pasta fresh when eating — reheated pasta gets mushy."
    },
    {
      id: 5,
      name: "Chicken Stir Fry",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      calories: 530,
      protein: "40g",
      cookTime: "20 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb chicken breast, sliced thin",
        "1 zucchini, sliced into half-moons",
        "1 bell pepper, sliced",
        "1/2 yellow onion, sliced",
        "2 cups cooked white rice",
        "3 tbsp soy sauce or coconut aminos",
        "1 tbsp honey",
        "1 tbsp sesame oil",
        "2 tbsp olive oil",
        "2 cloves garlic, minced",
        "1 tsp fresh ginger, minced (or 1/2 tsp ground)",
        "Sesame seeds, green onions for topping"
      ],
      instructions: [
        {
          step: 1,
          title: "Make the sauce (1 min)",
          detail: "Whisk together soy sauce, honey, and sesame oil in a small bowl. Set aside."
        },
        {
          step: 2,
          title: "Cook the chicken (5-6 min)",
          detail: "Slice chicken into thin strips. Heat 1 tbsp olive oil in wok or large skillet over high heat. Add chicken in a single layer. Don't stir for 2 min — you want a sear. Stir-fry another 3-4 min until cooked through. Remove to plate."
        },
        {
          step: 3,
          title: "Cook the vegetables (4-5 min)",
          detail: "Same pan, add remaining oil. Add zucchini, bell pepper, and onion. Stir-fry over high heat 3-4 min — veggies should be slightly charred but still crisp. Add garlic and ginger, cook 30 seconds until fragrant."
        },
        {
          step: 4,
          title: "Combine and finish (1-2 min)",
          detail: "Return chicken to pan. Pour sauce over everything. Toss to coat. Cook 1 min until sauce thickens slightly."
        },
        {
          step: 5,
          title: "Serve",
          detail: "Serve over white rice. Top with sesame seeds and sliced green onions."
        }
      ],
      mealPrepNotes: "Cook chicken and veggies in bulk. Store sauce separately. Reheat in skillet with splash of water to refresh. Cook rice fresh or portion with meals."
    },
    {
      id: 6,
      name: "Steak Tacos",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
      calories: 560,
      protein: "40g",
      cookTime: "25 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "1 lb flank steak or skirt steak",
        "8 corn tortillas (street taco size)",
        "1 avocado, diced",
        "2 tomatoes, diced",
        "1/2 yellow onion, diced",
        "Fresh cilantro",
        "2 tbsp olive oil",
        "Salt, pepper, cumin, chili powder, garlic powder",
        "Lime wedges",
        "Hot sauce (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Season the steak (5 min)",
          detail: "Remove steak from fridge 15-20 min before cooking to take off the chill. Pat dry. Season generously on both sides with salt, pepper, cumin, chili powder, garlic powder. Drizzle with oil, rub in."
        },
        {
          step: 2,
          title: "Cook the steak (8-12 min)",
          detail: "Heat cast iron or grill pan over high heat until smoking. Add steak — don't touch it for 4-5 min to get a good crust. Flip, cook another 4-5 min for medium-rare (125°F internal). Rest 5 min, then slice thin against the grain."
        },
        {
          step: 3,
          title: "Prep toppings",
          detail: "While steak rests, dice avocado, tomatoes, and onion. Chop cilantro, cut limes."
        },
        {
          step: 4,
          title: "Warm tortillas",
          detail: "Char tortillas directly over gas flame 20-30 sec per side, or in dry pan over high heat."
        },
        {
          step: 5,
          title: "Assemble tacos",
          detail: "Double up tortillas. Add sliced steak, top with avocado, tomato, onion, cilantro. Squeeze lime, add hot sauce if using."
        }
      ]
    },
    {
      id: 7,
      name: "Baked Tilapia + Green Beans + Sweet Potato",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      calories: 480,
      protein: "36g",
      cookTime: "25 min",
      tag: "Rest Day",
      mealPrep: false,
      ingredients: [
        "2 tilapia fillets (about 6 oz each)",
        "1 lb green beans, ends trimmed",
        "1 medium sweet potato, cubed",
        "3 tbsp olive oil, divided",
        "Salt, pepper, garlic powder, paprika",
        "Lemon",
        "Fresh parsley (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Roast sweet potato (20-25 min)",
          detail: "Preheat oven to 400°F. Toss sweet potato cubes with 1 tbsp oil, salt, pepper, garlic powder. Spread on baking sheet in single layer. Roast 20-25 min, flipping halfway."
        },
        {
          step: 2,
          title: "Add green beans (10 min)",
          detail: "After sweet potato has cooked 10-15 min, toss green beans with 1 tbsp oil and salt. Add to baking sheet with potatoes. Continue roasting."
        },
        {
          step: 3,
          title: "Bake the tilapia (10-12 min)",
          detail: "Place tilapia on a separate baking sheet or in a baking dish. Drizzle with remaining oil, season with salt, pepper, garlic powder, paprika. Squeeze lemon over top. Bake 10-12 min until fish flakes easily with a fork and is opaque throughout."
        },
        {
          step: 4,
          title: "Plate",
          detail: "Serve tilapia with sweet potato and green beans. Garnish with parsley and additional lemon if desired."
        }
      ]
    },
    {
      id: 8,
      name: "Burger Bowl",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      calories: 600,
      protein: "38g",
      cookTime: "20 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "1 lb ground beef (85/15)",
        "2 cups cooked white rice",
        "1 avocado, sliced",
        "2 tomatoes, diced",
        "1/2 yellow onion, diced",
        "Pickles, sliced",
        "Mustard and ketchup",
        "1 tbsp olive oil",
        "Salt, pepper, garlic powder, onion powder"
      ],
      instructions: [
        {
          step: 1,
          title: "Form and cook patties (10-12 min)",
          detail: "Divide beef into 4 portions. Form into patties slightly larger than you want (they shrink). Press a dimple in the center (prevents puffing). Season both sides with salt, pepper, garlic powder, onion powder. Heat oil in skillet over medium-high. Cook patties 4-5 min per side for medium. Let rest 2 min, then crumble or chop into chunks."
        },
        {
          step: 2,
          title: "Prep toppings",
          detail: "While patties cook, dice tomatoes and onion. Slice avocado and pickles."
        },
        {
          step: 3,
          title: "Build the bowl",
          detail: "Add rice to bowl. Top with burger chunks, avocado, tomato, onion, pickles. Drizzle with mustard and ketchup."
        }
      ],
      mealPrepNotes: "Cook patties in bulk. Reheat in skillet to maintain some texture. Add fresh toppings when eating."
    },
    {
      id: 9,
      name: "Teriyaki Salmon + White Rice + Asparagus",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
      calories: 560,
      protein: "38g",
      cookTime: "25 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "6 oz salmon fillet",
        "1 bunch asparagus, ends trimmed",
        "1 cup cooked white rice",
        "1/4 cup teriyaki sauce (store-bought or homemade)",
        "2 tbsp olive oil, divided",
        "Salt, pepper",
        "Sesame seeds",
        "Green onions, sliced"
      ],
      instructions: [
        {
          step: 1,
          title: "Cook rice",
          detail: "If not using leftover rice, cook according to package directions."
        },
        {
          step: 2,
          title: "Roast asparagus (10-12 min)",
          detail: "Preheat oven to 400°F. Toss asparagus with 1 tbsp oil, salt, pepper. Spread on baking sheet. Roast 10-12 min until tender and slightly charred."
        },
        {
          step: 3,
          title: "Cook salmon (10-12 min)",
          detail: "Pat salmon dry. Season with salt and pepper. Heat remaining oil in oven-safe skillet over medium-high heat. Sear salmon flesh-side down 3-4 min until golden. Flip, brush with teriyaki sauce. Transfer to oven at 400°F for 5-6 min until internal temp reaches 125°F."
        },
        {
          step: 4,
          title: "Plate",
          detail: "Serve salmon over rice with asparagus. Drizzle with extra teriyaki, top with sesame seeds and green onions."
        }
      ]
    },
    {
      id: 10,
      name: "Stuffed Bell Peppers",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
      calories: 520,
      protein: "35g",
      cookTime: "35 min",
      tag: "Everyday",
      mealPrep: true,
      ingredients: [
        "4 bell peppers (any color)",
        "1 lb ground turkey (93% lean)",
        "1 cup cooked white rice",
        "1 can (14 oz) diced tomatoes",
        "1/2 yellow onion, diced",
        "2 cloves garlic, minced",
        "1 tbsp olive oil",
        "Salt, pepper, cumin, chili powder, Italian seasoning",
        "Fresh parsley (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Prep the peppers (5 min)",
          detail: "Preheat oven to 375°F. Cut tops off bell peppers, remove seeds and membranes. Stand peppers upright in a baking dish. If they won't stand, slice a tiny bit off the bottom (don't puncture through)."
        },
        {
          step: 2,
          title: "Make the filling (10-12 min)",
          detail: "Heat oil in skillet over medium-high. Add onion, cook 3-4 min until softened. Add garlic, cook 30 seconds. Add ground turkey, break apart, cook until browned — about 6-8 min. Season with salt, pepper, cumin, chili powder, Italian seasoning."
        },
        {
          step: 3,
          title: "Combine filling (2 min)",
          detail: "Remove from heat. Stir in cooked rice and half the can of diced tomatoes (drained). Mix well."
        },
        {
          step: 4,
          title: "Stuff and bake (25-30 min)",
          detail: "Fill each pepper with the turkey-rice mixture, packing it in. Pour remaining diced tomatoes around the base of peppers in the dish. Cover with foil. Bake 20 min covered, then remove foil and bake 10 more min until peppers are tender and tops are slightly browned."
        },
        {
          step: 5,
          title: "Serve",
          detail: "Plate peppers with some of the tomato sauce from the dish. Garnish with parsley if using."
        }
      ],
      mealPrepNotes: "Make a full batch, store in fridge up to 4 days. Reheat in microwave 2-3 min or in oven at 350°F for 15 min."
    }
  ],
  snacks: [
    {
      id: 1,
      name: "Greek Yogurt + Granola + Berries",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
      calories: 280,
      protein: "18g",
      cookTime: "2 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "1 cup Greek yogurt",
        "1/4 cup granola",
        "1/2 cup mixed berries (strawberries, blueberries)",
        "1 tsp honey (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Assemble",
          detail: "Add yogurt to bowl. Top with granola and berries. Drizzle honey if using. Eat immediately — granola gets soggy fast."
        }
      ]
    },
    {
      id: 2,
      name: "Apple Slices + Almond Butter",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2uj38?w=400&h=300&fit=crop",
      calories: 250,
      protein: "6g",
      cookTime: "2 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "1 medium apple",
        "2 tbsp almond butter"
      ],
      instructions: [
        {
          step: 1,
          title: "Prep and dip",
          detail: "Core and slice apple into wedges. Serve with almond butter for dipping. Squeeze lemon on apple slices if prepping ahead to prevent browning."
        }
      ]
    },
    {
      id: 3,
      name: "Beef Jerky + Mixed Nuts",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop",
      calories: 300,
      protein: "22g",
      cookTime: "0 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "2 oz beef jerky (look for low sugar varieties)",
        "1/4 cup mixed nuts (almonds, cashews, walnuts)"
      ],
      instructions: [
        {
          step: 1,
          title: "Grab and go",
          detail: "No prep needed. Great for keeping in your desk or gym bag. Watch sodium content on jerky — aim for under 500mg per serving."
        }
      ]
    },
    {
      id: 4,
      name: "Hummus + Carrots + Cucumber",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
      calories: 200,
      protein: "6g",
      cookTime: "5 min",
      tag: "Rest Day",
      mealPrep: false,
      ingredients: [
        "1/3 cup hummus",
        "1 cup baby carrots or carrot sticks",
        "1/2 cucumber, sliced"
      ],
      instructions: [
        {
          step: 1,
          title: "Prep veggies",
          detail: "Slice cucumber into rounds or sticks. Use baby carrots or cut regular carrots into sticks."
        },
        {
          step: 2,
          title: "Serve",
          detail: "Portion hummus into small container or bowl. Dip and eat."
        }
      ]
    },
    {
      id: 5,
      name: "Banana + Almond Butter",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      calories: 280,
      protein: "7g",
      cookTime: "2 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1 medium banana",
        "2 tbsp almond butter"
      ],
      instructions: [
        {
          step: 1,
          title: "Prep and eat",
          detail: "Slice banana and spread almond butter on each slice. Or just peel, dip, and bite. Perfect pre-workout snack — easy to digest carbs plus healthy fats."
        }
      ]
    },
    {
      id: 6,
      name: "Dark Chocolate + Mixed Nuts",
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop",
      calories: 320,
      protein: "6g",
      cookTime: "0 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "1 oz dark chocolate (70% cacao or higher)",
        "1/4 cup mixed nuts"
      ],
      instructions: [
        {
          step: 1,
          title: "Portion and enjoy",
          detail: "Pre-portion into small containers to avoid eating the whole bar. Pair with nuts for sustained energy. Good evening snack when you want something sweet."
        }
      ]
    },
    {
      id: 7,
      name: "Rice Cakes + Almond Butter + Banana",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop",
      calories: 290,
      protein: "7g",
      cookTime: "3 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "2 rice cakes (plain or lightly salted)",
        "2 tbsp almond butter",
        "1/2 banana, sliced"
      ],
      instructions: [
        {
          step: 1,
          title: "Assemble",
          detail: "Spread almond butter on rice cakes. Top with banana slices. Good pre-workout option — quick carbs plus fats for sustained energy."
        }
      ]
    },
    {
      id: 8,
      name: "Protein Shake + Banana",
      image: "https://images.unsplash.com/photo-1622485831930-5e752ee4ae3f?w=400&h=300&fit=crop",
      calories: 300,
      protein: "28g",
      cookTime: "2 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1 scoop Legion protein powder",
        "1 cup almond milk",
        "1 medium banana",
        "Ice (optional)"
      ],
      instructions: [
        {
          step: 1,
          title: "Blend",
          detail: "Add almond milk, protein powder, banana, and ice to blender. Blend until smooth. Great post-workout — protein for recovery, banana for glycogen replenishment."
        }
      ]
    },
    {
      id: 9,
      name: "Turkey Jerky + Apple",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2uj38?w=400&h=300&fit=crop",
      calories: 220,
      protein: "18g",
      cookTime: "0 min",
      tag: "Everyday",
      mealPrep: false,
      ingredients: [
        "2 oz turkey jerky",
        "1 medium apple"
      ],
      instructions: [
        {
          step: 1,
          title: "Grab and go",
          detail: "No prep needed. Balanced snack — protein from jerky, carbs and fiber from apple. Keep jerky in your bag for convenience."
        }
      ]
    },
    {
      id: 10,
      name: "Trail Mix",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
      calories: 350,
      protein: "8g",
      cookTime: "0 min",
      tag: "Long Day",
      mealPrep: false,
      ingredients: [
        "1/4 cup almonds",
        "1/4 cup cashews",
        "2 tbsp dark chocolate chips",
        "2 tbsp dried mango, chopped"
      ],
      instructions: [
        {
          step: 1,
          title: "Make a batch",
          detail: "Mix all ingredients in a large container. Portion into small bags or containers (about 1/2 cup each) for grab-and-go. Calorie-dense — good for long training days when you need sustained energy."
        }
      ]
    }
  ]
};

export const SHOPPING_LIST_CATEGORIES = {
  proteins: [
    "Chicken breast",
    "Chicken thighs (boneless, skinless)",
    "Chicken sausage (Aidells or Applegate)",
    "Ground turkey (93% lean)",
    "Ground beef (85/15)",
    "Ribeye or sirloin steak",
    "Flank or skirt steak",
    "Salmon fillets",
    "Tilapia fillets",
    "Large eggs",
    "Greek yogurt",
    "Beef jerky",
    "Turkey jerky"
  ],
  carbs: [
    "White rice",
    "Old-fashioned oats",
    "Sweet potatoes",
    "Russet potatoes",
    "Sourdough bread",
    "Flour tortillas (burrito size)",
    "Corn tortillas (street taco size)",
    "Spaghetti or pasta",
    "Rice cakes"
  ],
  vegetables: [
    "Bell peppers (mixed colors)",
    "Yellow onions",
    "Asparagus",
    "Green beans",
    "Brussels sprouts",
    "Zucchini",
    "Carrots / baby carrots",
    "Cucumber",
    "Tomatoes / cherry tomatoes",
    "Romaine lettuce",
    "Green onions",
    "Garlic"
  ],
  fruits: [
    "Bananas",
    "Apples",
    "Strawberries",
    "Blueberries",
    "Mixed berries",
    "Avocados",
    "Lemons",
    "Limes",
    "Mango (fresh or dried)"
  ],
  pantry: [
    "Olive oil",
    "Almond butter",
    "Honey",
    "Soy sauce or coconut aminos",
    "Teriyaki sauce",
    "Marinara sauce",
    "Salsa",
    "Hummus",
    "Granola",
    "Mixed nuts (almonds, cashews, walnuts)",
    "Dark chocolate (70%+ cacao)",
    "Dark chocolate chips",
    "Chia seeds",
    "Sesame seeds"
  ],
  spicesAndSeasonings: [
    "Salt",
    "Black pepper",
    "Garlic powder",
    "Onion powder",
    "Cumin",
    "Chili powder",
    "Paprika",
    "Italian seasoning",
    "Oregano",
    "Cinnamon",
    "Everything bagel seasoning",
    "Red pepper flakes"
  ],
  dairy: [
    "Almond milk",
    "Butter",
    "Shredded cheese (Mexican blend — optional)"
  ],
  condiments: [
    "Hot sauce (Cholula, Tapatio, Sriracha)",
    "Mustard",
    "Ketchup",
    "Caesar dressing"
  ],
  supplements: [
    "Legion protein powder",
    "BPN electrolytes",
    "Creatine"
  ]
};

// Tag colors for meal cards
export const TAG_COLORS = {
  'Long Day': { bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-700' },
  'Rest Day': { bg: 'bg-blue-900/50', text: 'text-blue-400', border: 'border-blue-700' },
  'Everyday': { bg: 'bg-gray-700/50', text: 'text-gray-300', border: 'border-gray-600' },
};

// Food emoji placeholders by category
export const CATEGORY_ICONS = {
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍽️',
  snacks: '🥜',
};
