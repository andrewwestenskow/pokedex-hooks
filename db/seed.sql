DROP TABLE IF EXISTS pokemon_moves;
DROP TABLE IF EXISTS pokemon_ability;
DROP TABLE IF EXISTS pokemon_stat;
DROP TABLE IF EXISTS pokemon_game;
DROP TABLE IF EXISTS pokemon_item;
DROP TABLE IF EXISTS sprite;
DROP TABLE IF EXISTS evolution;
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS ability;
DROP TABLE IF EXISTS stat;
DROP TABLE IF EXISTS game_index;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS pokemon;

CREATE TABLE "pokemon" (
  "pokemon_id" serial PRIMARY KEY,
  "name" varchar(100),
  "sort_order" integer,
  "height" integer,
  "weight" integer,
  "id" integer,
  "base_experience" integer,
  "url" text unique,
  "species_url" text unique 
);

CREATE TABLE "sprite" (
  "sprite_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "front_default" text,
  "front_shiny" text,
  "front_female" text,
  "front_shiny_female" text,
  "back_default" text,
  "back_shiny" text,
  "back_female" text,
  "back_shiny_female" text
);

CREATE TABLE "item" (
  "item_id" serial PRIMARY KEY,
  "id" integer,
  "name" varchar(100),
  "cost" integer,
  "sprite" text,
  "url" text unique
);

CREATE TABLE "evolution" (
  "evolution_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "evolves_from" integer references pokemon(pokemon_id),
  "evolves_to" integer references pokemon(pokemon_id),
  "item" integer references item(item_id)
);

CREATE TABLE "moves" (
  "moves_id" serial PRIMARY KEY,
  "id" integer,
  "name" varchar(100),
  "accuracy" integer,
  "effect_chance" integer,
  "pp" integer,
  "power" integer,
  "damage_class" varchar(50),
  "type" varchar(50),
  "effect" text,
  "short_effect" text,
  "ailment" varchar(50),
  "crit_rate" integer,
  "ailmnet_chance" integer,
  "url" text unique
);

CREATE TABLE "pokemon_moves" (
  "pokemon_moves_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "moves_id" integer references moves(moves_id)
);

CREATE TABLE "ability" (
  "ability_id" serial PRIMARY KEY,
  "id" integer,
  "name" varchar(100),
  "effect" text,
  "short_effect" text,
  "url" text unique
);

CREATE TABLE "pokemon_ability" (
  "pokemon_ability_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "ability_id" integer references ability(ability_id)
);

CREATE TABLE "game_index" (
  "game_index_id" serial PRIMARY KEY,
  "id" integer,
  "name" varchar(100),
  "group" varchar(100),
  "url" text unique
);

CREATE TABLE "pokemon_game" (
  "pokemon_game_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "game_index_id" integer references game_index(game_index_id)
);

CREATE TABLE "pokemon_item" (
  "pokemon_item_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "item_id" integer references item(item_id)
);

CREATE TABLE "stat" (
  "stat_id" serial PRIMARY KEY,
  "pokemon_id" integer references pokemon(pokemon_id),
  "hp" integer,
  "attack" integer,
  "defense" integer,
  "special_attack" integer,
  "special_defense" integer,
  "speed" integer,
  "accuracy" integer,
  "evasion" integer
);
