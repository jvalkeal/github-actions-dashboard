create table if not exists hibernate_sequence (
  next_val bigint
);

insert into hibernate_sequence (next_val)
  select * from (select 1 as next_val) as temp
  where not exists(select * from hibernate_sequence);

create table branches (
  repository_entity_id bigint not null,
  branches varchar(255)
);

create table dashboard (
  id bigint not null,
  username varchar(255),
  description varchar(255),
  name varchar(255),
  primary key (id)
);

create table repositories (
  dashboard_entity_id bigint not null,
  repositories_id bigint not null,
  primary key (dashboard_entity_id, repositories_id)
);

create table repository (
  id bigint not null,
  owner varchar(255),
  repository varchar(255),
  title varchar(255),
  primary key (id)
);

create table user_setting (
  id bigint not null,
  name varchar(255),
  username varchar(255),
  value varchar(255),
  primary key (id)
);

alter table repositories
  add constraint uk_repositories_id unique (repositories_id);

alter table branches
  add constraint fk_repository_branches
  foreign key (repository_entity_id)
  references repository (id);

alter table repositories
  add constraint fk_dashboard_repositories_a
  foreign key (repositories_id)
  references repository (id);

alter table repositories
  add constraint fk_dashboard_repositories_t
  foreign key (dashboard_entity_id)
  references dashboard (id);
