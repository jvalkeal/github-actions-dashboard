create table repository_dispatch (
  id bigint not null,
  name varchar(255),
  username varchar(255),
  event_type varchar(255),
  client_payload longtext,
  primary key (id)
);
