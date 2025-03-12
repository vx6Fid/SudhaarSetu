--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Debian 15.12-1.pgdg120+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.admins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    phone character varying(15) NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admins OWNER TO admin;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    complaint_id uuid,
    comment_text text,
    likes_count integer DEFAULT 0,
    views_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comments OWNER TO admin;

--
-- Name: complaint_upvotes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.complaint_upvotes (
    id integer NOT NULL,
    user_id uuid,
    complaint_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.complaint_upvotes OWNER TO admin;

--
-- Name: complaint_upvotes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.complaint_upvotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complaint_upvotes_id_seq OWNER TO admin;

--
-- Name: complaint_upvotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.complaint_upvotes_id_seq OWNED BY public.complaint_upvotes.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.complaints (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    category character varying(255),
    location character varying(255),
    image character varying(2048),
    status character varying(20) DEFAULT 'pending'::character varying,
    upvotes integer DEFAULT 0,
    views integer DEFAULT 0,
    total_comments integer DEFAULT 0,
    comments uuid,
    field_officer_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ward_no integer NOT NULL,
    city character varying(255) NOT NULL,
    CONSTRAINT complaints_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'in_progress'::character varying, 'resolved'::character varying])::text[])))
);


ALTER TABLE public.complaints OWNER TO admin;

--
-- Name: officers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.officers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    phone character varying(15) NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    ward character varying(255) NOT NULL,
    CONSTRAINT officers_role_check CHECK (((role)::text = ANY ((ARRAY['field_officer'::character varying, 'call_center'::character varying])::text[])))
);


ALTER TABLE public.officers OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    phone character varying(15),
    role character varying(50) DEFAULT 'citizen'::character varying,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    ward character varying(100) NOT NULL,
    upvoted_complaints uuid[] DEFAULT '{}'::uuid[],
    feedback_given uuid[] DEFAULT '{}'::uuid[],
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['citizen'::character varying, 'field_officer'::character varying, 'call_center'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: complaint_upvotes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaint_upvotes ALTER COLUMN id SET DEFAULT nextval('public.complaint_upvotes_id_seq'::regclass);


--
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- Name: admins admins_phone_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_phone_key UNIQUE (phone);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: complaint_upvotes complaint_upvotes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaint_upvotes
    ADD CONSTRAINT complaint_upvotes_pkey PRIMARY KEY (id);


--
-- Name: complaint_upvotes complaint_upvotes_user_id_complaint_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaint_upvotes
    ADD CONSTRAINT complaint_upvotes_user_id_complaint_id_key UNIQUE (user_id, complaint_id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: officers officers_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_email_key UNIQUE (email);


--
-- Name: officers officers_phone_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_phone_key UNIQUE (phone);


--
-- Name: officers officers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: comments comments_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id);


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: complaint_upvotes complaint_upvotes_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaint_upvotes
    ADD CONSTRAINT complaint_upvotes_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaint_upvotes complaint_upvotes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaint_upvotes
    ADD CONSTRAINT complaint_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_field_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_field_officer_id_fkey FOREIGN KEY (field_officer_id) REFERENCES public.officers(id);


--
-- Name: complaints complaints_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

