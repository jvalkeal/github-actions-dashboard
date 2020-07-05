alter table dashboard
  add column team varchar(255);

alter table repository_dispatch
  add column team varchar(255);
