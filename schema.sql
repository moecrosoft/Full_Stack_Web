create table if not exists public.food_logs (
    id bigint generated always as identity primary key,
    food_name text not null,
    image_url text not null,
    created_at timestamp with time zone default now()
);

create table if not exists public.sources (
    id bigint generated always as identity primary key,
    title text not null,
    file_url text not null,
    file_type text not null,
    created_at timestamp with time zone default now()
);

create table if not exists public.notes (
    id bigint generated always as identity primary key,
    content text not null,
    created_at timestamp with time zone default now()
);