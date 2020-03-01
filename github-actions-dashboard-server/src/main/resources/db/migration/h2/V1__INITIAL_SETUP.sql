create sequence hibernate_sequence start with 1 increment by 1;

create table user_setting (
    id bigint not null,
    username varchar(255),
    name varchar(255),
    value varchar(255),
    primary key (id)
);
