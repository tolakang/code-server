/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('username').notNullable().unique();
      table.string('email').notNullable().unique();
      table.string('full_name').notNullable().defaultTo('');
      table.enum('role', ['admin', 'editor', 'viewer']).notNullable().defaultTo('viewer');
      table.enum('status', ['active', 'inactive', 'pending']).notNullable().defaultTo('active');
      table.timestamp('last_login');
      table.timestamps(true, true);
    })
    .createTable('teams', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable().unique();
      table.text('description').defaultTo('');
      table.timestamps(true, true);
    })
    .createTable('team_members', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('team_id').notNullable().references('id').inTable('teams').onDelete('CASCADE');
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.unique(['team_id', 'user_id']);
    })
    .createTable('audit_logs', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.string('action').notNullable();
      table.string('resource').notNullable();
      table.jsonb('details').defaultTo('{}');
      table.string('ip_address');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('notifications', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.text('message').notNullable().defaultTo('');
      table.boolean('read').notNullable().defaultTo(false);
      table.string('type').notNullable().defaultTo('info');
      table.timestamps(true, true);
    })
    .createTable('workspaces', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('path').notNullable();
      table.uuid('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('workspaces')
    .dropTableIfExists('notifications')
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('team_members')
    .dropTableIfExists('teams')
    .dropTableIfExists('users');
};
