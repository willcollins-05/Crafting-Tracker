import { relations as drizzleRelations } from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull()
})

export const materials = sqliteTable('materials', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
})

export const items = sqliteTable('items', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    taskId: integer('task_id').references(() => tasks.id),
})

export const recipes = sqliteTable('recipes', {
    id: integer('id').primaryKey({autoIncrement: true}),
    itemId: integer('item_id').notNull().references(() => items.id),
    materialId: integer('material_id').notNull().references(() => materials.id),
    quantity: integer('quantity').notNull(),
    quantityOwned: integer('quantity_owned').notNull(),
})


export const taskRelations = drizzleRelations(tasks, ({many}) => ({
    items: many(items),
}))

export const itemRelations = drizzleRelations(items, ({one, many}) => ({
    task: one(tasks, {
        fields: [items.taskId],
        references: [tasks.id],
    }),
    recipes: many(recipes)
}))

export const materialRelations = drizzleRelations(materials, ({many}) => ({
    recipes: many(recipes)
}))

export const recipeRelations = drizzleRelations(recipes, ({one}) => ({
    items: one(items, {
        fields: [recipes.itemId],
        references: [items.id],
    }),
    materials: one(materials, {
        fields: [recipes.materialId],
        references: [materials.id],
    })
}))