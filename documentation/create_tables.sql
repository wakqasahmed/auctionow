-- Table: public.inventory

CREATE SEQUENCE inventory_id_seq;

CREATE TABLE public.inventory
(
  id integer NOT NULL DEFAULT nextval('inventory_id_seq'::regclass),
  "userId" integer,
  itemName character varying(255) NOT NULL,  
  "itemQuantity" integer,
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT "inventory_userId_fkey" FOREIGN KEY ("userId")
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL    
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.inventory
  OWNER TO postgres;

-- Table: public.auction

CREATE SEQUENCE auction_id_seq;

CREATE TABLE public.auction
(
  id integer NOT NULL DEFAULT nextval('auction_id_seq'::regclass),
  "inventoryId" integer,
  "winnerId" integer,
  "sellerId" integer,
  isActive boolean,  
  "winningBidAmount" integer,  
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT auction_pkey PRIMARY KEY (id),
  CONSTRAINT "auction_seller_userId_fkey" FOREIGN KEY ("sellerId")
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL,    
  CONSTRAINT "auction_winner_userId_fkey" FOREIGN KEY ("winnerId")
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT "auction_inventoryId_fkey" FOREIGN KEY ("inventoryId")
      REFERENCES public.inventory (id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE SET NULL           
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.auction
  OWNER TO postgres;
