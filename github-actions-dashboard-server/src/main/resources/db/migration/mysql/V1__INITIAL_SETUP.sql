-- create table if not exists hibernate_sequence (
--     next_val bigint
-- );

-- insert into hibernate_sequence (next_val)
--     select * from (select 1 as next_val) as temp
--     where not exists(select * from hibernate_sequence);
create sequence hibernate_sequence start with 1 increment by 1;

create table user_setting (
    id bigint not null,
    username varchar(255),
    name varchar(255),
    value varchar(255),
    primary key (id)
);
