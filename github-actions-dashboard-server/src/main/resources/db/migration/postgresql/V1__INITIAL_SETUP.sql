create sequence hibernate_sequence start 1 increment 1;

create table branches (
  repository_entity_id int8 not null,
  branches varchar(255)
);

create table dashboard (
  id int8 not null,
  username varchar(255),
  description varchar(255),
  name varchar(255),
  primary key (id)
);

create table dashboard_repositories (
  dashboard_entity_id int8 not null,
  repositories_id int8 not null,
  primary key (dashboard_entity_id, repositories_id)
);

create table repository (
  id int8 not null,
  owner varchar(255),
  repository varchar(255),
  primary key (id)
);

create table user_setting (
  id int8 not null,
  name varchar(255),
  username varchar(255),
  value varchar(255),
  primary key (id)
);

alter table if exists branches
  add constraint fk_repository_branches
  foreign key (repository_entity_id)
  references repository;

alter table if exists dashboard_repositories
  add constraint fk_dashboard_repositories_a
  foreign key (repositories_id)
  references repository;

alter table if exists dashboard_repositories
  add constraint fk_dashboard_repositories_t
  foreign key (dashboard_entity_id)
  references dashboard;
