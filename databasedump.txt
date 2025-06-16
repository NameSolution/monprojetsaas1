--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    hotel_id uuid,
    user_id uuid,
    started_at timestamp without time zone DEFAULT now(),
    last_message_at timestamp without time zone
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- Name: hotel_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotel_languages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    hotel_id uuid NOT NULL,
    lang_code character varying(10) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hotel_languages OWNER TO postgres;

--
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    logo_url character varying(255),
    default_lang_code character varying(10) DEFAULT 'en'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    plan_id uuid,
    user_id uuid,
    theme_color text,
    font_family text,
    primary_language text,
    custom_domain text,
    chat_title text,
    accent_color character varying(20),
    support_phone character varying(30),
    welcome_message text,
    header_text text,
    footer_text text,
    booking_link text,
    contact_name text,
    knowledge_base text,
    contact_email text,
    slug text,
    address text,
    phone text,
    email text,
    status text
);


ALTER TABLE public.hotels OWNER TO postgres;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    code character varying(10) NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'client'::character varying NOT NULL,
    hotel_id uuid,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    features jsonb,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(50) DEFAULT 'open'::character varying NOT NULL,
    priority character varying(50) DEFAULT 'medium'::character varying NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, hotel_id, user_id, started_at, last_message_at) FROM stdin;
\.


--
-- Data for Name: hotel_languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotel_languages (id, tenant_id, hotel_id, lang_code, is_active, created_at) FROM stdin;
2db39e64-f107-4a10-8857-32c26b22c589    1       550e8400-e29b-41d4-a716-446655440000    fr      t       2025-06-14 22:41:14.340633+00
69ba8d9c-b575-4685-abaf-51600079fa58    1       550e8400-e29b-41d4-a716-446655440000    en      t       2025-06-14 22:41:14.340633+00
\.


--
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, tenant_id, name, description, logo_url, default_lang_code, created_at, updated_at, plan_id, user_id, theme_color, font_family, primary_language, custom_domain, chat_title, accent_color, support_phone, welcome_message, header_text, footer_text, booking_link, contact_name, knowledge_base, contact_email, slug, address, phone, email, status) FROM stdin;
550e8400-e29b-41d4-a716-446655440000    1       Demo Hotel      A demonstration hotel for testing       \N      en      2025-06-14 22:41:14.115447+00   2025-06-14 22:41:14.115447+00       \N      b8174ed8-da15-41ae-a0aa-2a20d427a5aa    \N      \N      \N      \N      \N      \N      \N      \N      \N      \N      \N      \N      \N      \N \N       \N      \N      \N      \N
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (code, tenant_id, name) FROM stdin;
es      1       Español
fr      1       Français
de      1       Deutsch
en      1       English
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, tenant_id, name, role, hotel_id, user_id, created_at, updated_at) FROM stdin;
a4680a15-0124-48fd-ac02-e112958755d0    1       Admin Demo      admin   550e8400-e29b-41d4-a716-446655440000    b8174ed8-da15-41ae-a0aa-2a20d427a5aa    2025-06-14 22:41:14.339657+00       2025-06-14 22:41:14.339657+00
b827dc93-0072-4e98-b3bc-1e38940432e7    1       Super Admin     superadmin      \N      e1aef2c3-fbfe-4f8f-b529-59095359c805    2025-06-14 22:41:14.238358+00   2025-06-14 22:41:14.238358+00
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, tenant_id, name, price, features, is_active, created_at) FROM stdin;
7ad66d2f-358e-4fe8-85d9-cf4313d314aa    1       Pro     79.99   {"languages": 15, "conversations": 5000}        t       2025-06-14 22:41:14.111453+00
54e4647c-59c0-4073-a954-14e798f6af2f    1       Basic   29.99   {"languages": 5, "conversations": 1000} t       2025-06-14 22:41:14.111453+00
7bd28329-4a3e-4bdd-b8b5-be6a76de0203    1       Enterprise      199.99  {"languages": -1, "conversations": -1}  t       2025-06-14 22:41:14.111453+00
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, tenant_id, title, description, status, priority, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, tenant_id, email, password_hash, created_at, updated_at) FROM stdin;
e1aef2c3-fbfe-4f8f-b529-59095359c805    1       pass@passhoteltest.com  $2b$10$bdRI18.fl8qHshlRRCEkuOdt.JXYDjGcGryWMM6O5hFNaR1ilwp/e    2025-06-14 22:41:14.236744+00   2025-06-14 22:41:14.236744+00
b8174ed8-da15-41ae-a0aa-2a20d427a5aa    1       admin@example.com       $2b$10$noxCBd3Cn9ddRhfCCHZkvegbtlPLoEJRuH85CAyPDZaBXpYprQyci    2025-06-14 22:41:14.338495+00   2025-06-14 22:41:14.338495+00
\.


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: hotel_languages hotel_languages_hotel_id_lang_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_languages
    ADD CONSTRAINT hotel_languages_hotel_id_lang_code_key UNIQUE (hotel_id, lang_code);


--
-- Name: hotel_languages hotel_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_languages
    ADD CONSTRAINT hotel_languages_pkey PRIMARY KEY (id);


--
-- Name: hotels hotels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_pkey PRIMARY KEY (id);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (code);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: subscription_plans subscription_plans_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_name_key UNIQUE (name);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_hotel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES public.hotels(id);


--
-- Name: conversations conversations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hotels fk_hotel_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT fk_hotel_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hotels fk_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: hotel_languages hotel_languages_hotel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_languages
    ADD CONSTRAINT hotel_languages_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES public.hotels(id);


--
-- Name: profiles profiles_hotel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_hotel_id_fkey FOREIGN KEY (hotel_id) REFERENCES public.hotels(id);


--
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: support_tickets support_tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

root@ubuntu:~/monprojetsaas1#
