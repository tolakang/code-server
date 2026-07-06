/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clean existing data
  await knex('team_members').del();
  await knex('notifications').del();
  await knex('audit_logs').del();
  await knex('workspaces').del();
  await knex('teams').del();
  await knex('users').del();

  // Create default admin user
  const [admin] = await knex('users')
    .insert({
      username: 'admin',
      email: 'admin@localhost',
      full_name: 'Administrator',
      role: 'admin',
      status: 'active',
    })
    .returning('*');

  // Create default team
  const [team] = await knex('teams')
    .insert({
      name: 'Default Team',
      description: 'The default workspace team',
    })
    .returning('*');

  // Add admin to team
  await knex('team_members').insert({
    team_id: team.id,
    user_id: admin.id,
  });

  // Create default workspace
  await knex('workspaces').insert({
    name: 'Project',
    path: '/home/coder/project',
    user_id: admin.id,
  });
};
