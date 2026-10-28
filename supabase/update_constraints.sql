-- ============================================================
-- Update type, locality and status CHECK constraints
-- Supabase SQL Editor mein run karo
-- ============================================================

-- 1. Drop old type constraint, add new with apartment + house
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_type_check;
ALTER TABLE properties ADD CONSTRAINT properties_type_check
  CHECK (type IN ('villa','penthouse','mansion','apartment','house','plot','commercial'));

-- 2. Drop old status constraint, add for_rent
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status IN ('for_sale','for_rent','new_listing','coming_soon','preview','sold'));

-- 3. Drop old locality constraint, add all Indore colonies
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_locality_check;
ALTER TABLE properties ADD CONSTRAINT properties_locality_check
  CHECK (locality IN (
    'vijay_nagar','nipania','palasia_saket','bypass_road',
    'ab_road','aerodrome','annapurna','aranya',
    'bhanwarkuan','bhawarkuan','bicholi_hapsi','bicholi_mardana',
    'bombay_hospital','chandan_nagar','chandragupt','chhota_bangarda',
    'devguradia','dhar_road','electronic_complex',
    'futi_kothi','geeta_bhawan','guru_nanak','gumasta_nagar',
    'hindi_nagar','indrapuri','jail_road',
    'kanadiya_road','kesar_bagh','khajrana',
    'lasudiya','lasudia_mori','lokmanya_nagar','luv_kush',
    'mahalaxmi_nagar','malharganj','manglia','marimata',
    'marimata_chouraha','mig_colony','mr_10','mr_9',
    'nanda_nagar','navlakha','new_palasia','niranjanpur',
    'old_palasia','omaxe_city',
    'palhar_nagar','pardesipura','pipliyahana','pithampur_road',
    'rajendra_nagar','rajiv_gandhi','rau','residency_area',
    'ring_road','ring_road_colony',
    'saket','sanawadia','sangam_nagar','sapna_sangeeta',
    'sarwate','scheme_54','scheme_71','scheme_74','scheme_78',
    'shreenath','silicon_city','skema','sneh_nagar',
    'srinath_nagar','subhash_nagar','sudama_nagar','super_corridor',
    'tejaji_nagar','tilak_nagar','tukoganj',
    'ujjain_road','usha_nagar',
    'vallabh_nagar','veena_nagar','vijay_nagar_ext',
    'vishnupuri','yeshwant_niwas',
    'off_market'
  ));

SELECT 'Constraints updated successfully!' as status;
