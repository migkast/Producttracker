-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.products (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    image_url text,
    url text not null,
    category text not null,
    current_price decimal not null,
    lowest_price decimal not null,
    highest_price decimal not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.price_history (
    id uuid default uuid_generate_v4() primary key,
    product_id uuid references public.products(id) on delete cascade,
    price decimal not null,
    retailer text not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    is_premium boolean default false,
    stripe_customer_id text,
    subscription_id text,
    subscription_status text,
    referral_code text unique,
    referred_by uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_products (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    target_price decimal not null,
    notify_on_price_drop boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    message text not null,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_stats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    tracked_products integer default 0,
    successful_referrals integer default 0,
    total_savings decimal default 0,
    badges_earned integer default 0,
    active_alerts integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_badges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    badge_id text not null,
    awarded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_products_updated_at
    before update on public.products
    for each row
    execute function public.handle_updated_at();

create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row
    execute function public.handle_updated_at();

-- Create function to generate referral code
create or replace function public.generate_referral_code()
returns trigger as $$
begin
    new.referral_code = substr(md5(new.id::text), 1, 8);
    return new;
end;
$$ language plpgsql;

-- Create trigger for referral code generation
create trigger handle_referral_code_generation
    before insert on public.profiles
    for each row
    execute function public.generate_referral_code();

-- Create function to update user stats
create or replace function public.handle_user_stats()
returns trigger as $$
begin
    insert into public.user_stats (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
    return new;
end;
$$ language plpgsql;

-- Create trigger for user stats initialization
create trigger initialize_user_stats
    after insert on public.profiles
    for each row
    execute function public.handle_user_stats();

-- Enable Row Level Security
alter table public.products enable row level security;
alter table public.price_history enable row level security;
alter table public.profiles enable row level security;
alter table public.user_products enable row level security;
alter table public.notifications enable row level security;
alter table public.user_stats enable row level security;
alter table public.user_badges enable row level security;

-- Create policies
create policy "Public products are viewable by everyone"
    on public.products for select
    using (true);

create policy "Users can view their tracked products"
    on public.user_products for select
    using (auth.uid() = user_id);

create policy "Users can insert their tracked products"
    on public.user_products for insert
    with check (auth.uid() = user_id);

create policy "Users can update their tracked products"
    on public.user_products for update
    using (auth.uid() = user_id);

create policy "Users can delete their tracked products"
    on public.user_products for delete
    using (auth.uid() = user_id);

create policy "Users can view their notifications"
    on public.notifications for select
    using (auth.uid() = user_id);

create policy "Users can update their notifications"
    on public.notifications for update
    using (auth.uid() = user_id);

create policy "Users can view their profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can view price history"
    on public.price_history for select
    using (true);

create policy "Users can view their stats"
    on public.user_stats for select
    using (auth.uid() = user_id);

create policy "Users can view their badges"
    on public.user_badges for select
    using (auth.uid() = user_id);

-- Create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$ language plpgsql;

-- Create trigger for new user signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Insert some sample products
insert into public.products (name, description, image_url, url, category, current_price, lowest_price, highest_price) values
('MacBook Air M2', 'Latest Apple MacBook Air with M2 chip', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'https://apple.com', 'laptops', 999, 999, 1199),
('Sony WH-1000XM4', 'Wireless Noise Cancelling Headphones', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', 'https://sony.com', 'audio', 248, 248, 349),
('Samsung Galaxy S23', 'Latest Samsung flagship smartphone', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'https://samsung.com', 'smartphones', 799, 799, 999);