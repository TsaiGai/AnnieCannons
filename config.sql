ALTER TABLE provider_org_table 
ADD COLUMN updatedAt DATE,
ADD COLUMN provider_id SERIAL,
ADD COLUMN provider_name VARCHAR,
ADD COLUMN provider_start_hours VARCHAR,
ADD COLUMN provider_close_hours VARCHAR,
ADD COLUMN provider_phone VARCHAR,
ADD COLUMN provider_hotline VARCHAR,
ADD COLUMN provider_address1 VARCHAR,
ADD COLUMN provider_address2 VARCHAR,
ADD COLUMN provider_address3 VARCHAR,
ADD COLUMN provider_website VARCHAR,
ADD COLUMN provider_instagram VARCHAR,
ADD COLUMN provider_facebook VARCHAR,
ADD COLUMN org_for_who VARCHAR,
ADD COLUMN org_our_services VARCHAR,
ADD COLUMN org_we_are VARCHAR,
ADD COLUMN provider_nonpublic_info VARCHAR,
ADD COLUMN required_variables_intake VARCHAR[],
ADD COLUMN required_variables_general VARCHAR[],
ADD COLUMN avatar_colors VARCHAR[], 
ADD COLUMN provider_ages_served VARCHAR[],
ADD COLUMN provider_services_offered VARCHAR[],
ADD COLUMN provider_genders_served VARCHAR[],
ADD COLUMN provider_other_characteristics VARCHAR[],
ADD COLUMN provider_county VARCHAR[],
ADD COLUMN email_help VARCHAR,
ADD COLUMN activity_level VARCHAR,
ADD COLUMN created_by VARCHAR,
ADD COLUMN email_intake_notify VARCHAR,
ADD COLUMN deleted_reason VARCHAR[],
ADD COLUMN deleted_other VARCHAR,
ADD COLUMN deleted_date DATE,
ADD COLUMN is_visible BOOLEAN,
ADD COLUMN reinstated_date DATE,


ALTER TABLE participant_survivor_connection
ADD COLUMN participant_id INTEGER,
ADD COLUMN provider VARCHAR,
ADD COLUMN participant_status VARCHAR,
ADD COLUMN participant_status_notification BOOLEAN,

ALTER TABLE provider_participant_intake
ADD COLUMN participant_id INTEGER,
ADD COLUMN provider VARCHAR,
ADD COLUMN address_line1 VARCHAR,
ADD COLUMN address_line2 VARCHAR,
ADD COLUMN address_city VARCHAR,
ADD COLUMN address_state VARCHAR,
ADD COLUMN address_zipcode VARCHAR,
ADD COLUMN gender VARCHAR,
ADD COLUMN sexual_orientation VARCHAR,
ADD COLUMN ethnicity VARCHAR,
ADD COLUMN children VARCHAR,
ADD COLUMN num_of_children INTEGER,
ADD COLUMN foster_care VARCHAR,
ADD COLUMN incarceration VARCHAR,
ADD COLUMN immigration VARCHAR,
ADD COLUMN disability VARCHAR[], 
ADD COLUMN intake_form_completed DATE,
ADD COLUMN first_name VARCHAR,
ADD COLUMN last_name VARCHAR,
ADD COLUMN preferred_name VARCHAR,
ADD COLUMN survivorship VARCHAR[],
ADD COLUMN county_services VARCHAR,
ADD COLUMN county_location VARCHAR,
ADD COLUMN phone VARCHAR,
ADD COLUMN email VARCHAR,
ADD COLUMN participant_status VARCHAR,
ADD COLUMN preferred_language VARCHAR,
ADD COLUMN date_of_birth DATE,
ADD COLUMN unhoused BOOLEAN, 
ADD COLUMN general_form_completed DATE,
ADD COLUMN first_name_general VARCHAR,
ADD COLUMN last_name_general VARCHAR,
ADD COLUMN preferred_name_general VARCHAR,
ADD COLUMN phone_general VARCHAR,
ADD COLUMN email_general VARCHAR,


ALTER TABLE provider_required_questions
ADD COLUMN question_code VARCHAR,
ADD COLUMN question_label VARCHAR,
ADD COLUMN places_asked VARCHAR,
ADD COLUMN edit_format VARCHAR,
ADD COLUMN display_format VARCHAR,
ADD COLUMN data_type VARCHAR,
ADD COLUMN response_options VARCHAR[]

ALTER TABLE provider_user_table 
ADD COLUMN user_id VARCHAR,
ADD COLUMN provider VARCHAR,
ADD COLUMN createdAt DATE,
ADD COLUMN updatedAt DATE,
ADD COLUMN role VARCHAR,

ALTER TABLE provider_participant_table
ADD COLUMN createdAt DATE,
ADD COLUMN updatedAt DATE,
ADD COLUMN participant_id integer,
ADD COLUMN participant_status VARCHAR,
ADD COLUMN provider VARCHAR,
ADD COLUMN provider_people_note VARCHAR,
ADD COLUMN participant_status_notification boolean

ALTER TABLE provider_saved_searches
ADD COLUMN provider VARCHAR,
ADD COLUMN search_name VARCHAR,
ADD COLUMN search_date DATE,
ADD COLUMN search_filter_configuration VARCHAR[],
ADD COLUMN search_id VARCHAR

ALTER TABLE provider_participant_saved_searches
ADD COLUMN participant_id INTEGER,
ADD COLUMN provider_email VARCHAR,
ADD COLUMN provider VARCHAR,
ADD COLUMN search_name VARCHAR,
ADD COLUMN search_date DATE,
ADD COLUMN search_filter_configuration VARCHAR[],
ADD COLUMN search_id VARCHAR,

ALTER TABLE survivor_intake_form
ADD COLUMN participant_id VARCHAR,
ADD COLUMN gender VARCHAR,
ADD COLUMN address_line1 VARCHAR,
ADD COLUMN address_line2 VARCHAR,
ADD COLUMN address_city VARCHAR,
ADD COLUMN address_state VARCHAR,
ADD COLUMN address_zipcode VARCHAR,
ADD COLUMN preferred_name VARCHAR,
ADD COLUMN first_name VARCHAR,
ADD COLUMN last_name VARCHAR,
ADD COLUMN phone VARCHAR,
ADD COLUMN email VARCHAR,
ADD COLUMN age VARCHAR,
ADD COLUMN survivorship VARCHAR[],
ADD COLUMN county_location VARCHAR,
ADD COLUMN county_services VARCHAR[],
ADD COLUMN preferred_language VARCHAR,
ADD COLUMN gender VARCHAR,
ADD COLUMN sexual_orientation VARCHAR,
ADD COLUMN ethnicity VARCHAR,
ADD COLUMN children VARCHAR,
ADD COLUMN num_of_children VARCHAR,
ADD COLUMN foster_care VARCHAR,
ADD COLUMN incarceration VARCHAR,
ADD COLUMN immigration VARCHAR,
ADD COLUMN accommodations VARCHAR[]




-- marriage_years # IS AN INT TO RUN QUERYS, "CHILDREN" IS A LABEL IN THE FRONTEND
-- CHILDREN # IS AN INT TO RUN QUERYS, "CHILDREN" IS A LABEL IN THE FRONTEND
--ADD more info while building FE

ALTER TABLE survivor_general_form
ADD COLUMN participant_id VARCHAR,
ADD COLUMN preferred_name VARCHAR,
ADD COLUMN date_of_birth DATE,
ADD COLUMN survivorship VARCHAR[],
ADD COLUMN county_services VARCHAR,
ADD COLUMN county_location VARCHAR,
ADD COLUMN phone VARCHAR,
ADD COLUMN email VARCHAR,
ADD COLUMN general_form_completed VARCHAR,
ADD COLUMN providers VARCHAR[],
ADD COLUMN participant_lastname VARCHAR


--Change user_favorites if needed


ALTER TABLE provider_help_form_table
ADD COLUMN provider_name VARCHAR,
ADD COLUMN user_id VARCHAR,
ADD COLUMN provider_message VARCHAR,
ADD COLUMN created_at DATE


required_variables_intake=ARRAY['preferred_name','date_of_birth','survivorship','county_services','county_location', 'phone','email']

UPDATE provider_org_table SET required_variables_intake= ARRAY['preferred_name','date_of_birth','survivorship','county_location','phone','email','participant_lastname']



---------------------------NOTES----------------------------------------------------------------------------------------
-- provider_participant_table DONT TRACK SENSITIVE DATA(NAME AND DATE DOB), TRACK , consider location and identification but not Personal information

-- Query provider_saved_searches 
--  INTO provider_saved_searches(provider_email, search_name, search_date, search_filter_configuration) VALUES('hummingbird@anniecannons.com', 'My Search', '2021-05-01', ARRAY ['Under 18 years old', 'Housing', 'Case Management', 'San Francisco County', 'Female', 'Trans Female', 'Drop In Available', 'Open Now'])



"AnnieCannons"
"DreamCatcher"
"Freedom Forward"
"International Rescue Committee of Oakland"
"Huckleberry Youth Services"
"Rubys Place - Hayward"
"SF SafeHouse"



  
  
UPDATE provider_org_table SET  provider_id='7' ,provider_start_hours = '09:00am', provider_close_hours = '06:00pm', provider_phone ='(510)-581-5626' , provider_hotline = '(888) 339-7233', provider_addresses = ARRAY['20880 Baker Rd, Castro Valley, CA 94546'], provider_website = '"https://www.thisIsMySite6.com"', provider_instagram = 'https://www.instagram.com/thisIsMySite6', provider_facebook = 'https://www.facebook.com/thisIsMySite6', 
provider_details = ARRAY['18 years old and older', 'Housing', 'Counseling', 'San Francisco County', 'Fluid', 'Non Binary', 'Drop In Available', ],
 org_for_who= 'Individuals who are or have been part of sexual or labor exploitation from 18 years and older.', 
 org_our_services='Financing, Legal Support, Housing and Re-Entry, Life Coaching and Healing, Freedom Circles.',
 org_we_are='We are a leadership and advocacy organization led by systems-involved young and adult women and transgender gender non-conforming (TGNC) people of color who have grown up in poverty, worked in the underground street economy, and have been criminalized by social services such as foster care, welfare, and the mental health systems. By offering safety, sister- & siblinghood, economic opportunities, accessible education and healing, we build self - determination, confidence and self - worth.', 
 provider_nonpublic_info='Case manager name: Ruby, phone number:533-848-4383'
 WHERE provider_name = 'Rubys Place - Hayward'
  
   "id": '3456789asdf',
        "name": "(A) Women's Empowerment Center", XXXXXXXXXXXXDONE
        "avatarColors": ["#9013FE", "#7ED321"],
        "agesServed": ["Under 18 years old"],
        "typesOfServices": ["Housing", "Counseling"],
        "location": "San Francisco County",
        "gendersServed": ["Fluid", "Non Binary"],
        "moreFilters": ["Drop In Available", "Children Allowed"],
        "phoneNumber": "123-456-7890",       XXXXXXXXXXXXDONE
        "hotline24Hours": "123-456-0000", 
        "openHours": "8am - 9pm", XXXXXXXXXXXXDONE
        "address": ["832 Larkin Street, Suite 600 San Francisco, CA 94107", "213 Taylor Street, Suite 203 Oakland, CA 94610"],
        "whoWeHelp": "Individuals who are or have been part of the underground street economy from the ages of 16-24.",
        "ourServices": "Housing and Re-Entry, Life Coaching and Healing, Freedom Circles, Participatory Defense.",
        "whoWeAre": "We are a leadership and advocacy organization led by systems-involved young and adult women and transgender gender non-conforming (TGNC) people of color who have grown up in poverty, worked in the underground street economy, and have been criminalized by social services such as foster care, welfare, and the mental health systems. By offering safety, sister- & siblinghood, economic opportunities, accessible education and healing, we build self - determination, confidence and self - worth.",
        "website": "https://www.thisIsMySite.com",
        "facebookLink": "https://www.facebook.com/thisIsMySite",
        "instagramLink": "https://www.instagram.com/thisIsMySite",


UPDATE provider_participant_table SET participant_status='Applied: Awaiting Response', participant_status_notification= false
WHERE participant_id=2


UPDATE provider_org_table SET required_variables_intake= ARRAY['gender','county_born','state_born','country_born','preferred_language','address_line1','address_city','address_state','address_zipcode'] 

"Name"
"First Name"
"Last Name"
"Phone"
"Email"
"Address"
"age"
"gender"
"survivorship"
"county_services"
"county_location"
"preferred_language"
"foster_care"
"children"
"num_children"
"incarceration"
"immigration"
"ethnicity"
"sexual_orientation"
"accommodations"


INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) 
VALUES(ARRAY['preferred_name'], 'Name','general/intake','input','paragraph',ARRAY[''],'string')
INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES(ARRAY['address'], 'Address','intake','5 inputs,1 radio button','paragraph',ARRAY['Address line 1', 'Address line 2' ,'City', 'State', 'Zipcode', 'N/A,homeslessness' ],'string')

INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES(ARRAY['survivorship'], 'I identify as (Check all that apply).','general/intake','Checkbox','Checkbox',ARRAY['survivor of human trafficking',
'survivor of commercial sexual exploitation or labor exploitation',
'sex worker','survivor of domestic violence',
'survivor of sexual violence',
'none of the above'],'array')


-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('preferred_name', 'Name','general/intake','input','paragraph',ARRAY[''],'string')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('email', 'Email','general/intake','input','paragraph',ARRAY[''],'string')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES(ARRAY['county_location'], 'In what county are you currently located in?','general/intake','Dropdown','paragraph',ARRAY[''],'string')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('county_services', 'In what county do you want to receive services in?','general/intake','Checkbox','Checkbox',ARRAY['Alameda County','San Francisco County','Contra Costa County','Marin County','Santa Clara County','San Mateo County'],'array')
-- UPDATE provider_required_questions SET question_code='county_location' WHERE question_label = 'In what county are you currently located in?'
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('preferred_language', 'Primary language spoken','intake','Checkbox','Checkbox',ARRAY['English','Spanish','Mandarin','Cantonese','Tagalog','None of the above'],'array')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('gender', 'Gender identity','intake','Checkbox','Checkbox',ARRAY['Female','Trans-Female','Trans-Male','Male','Non-Binary','Fluid'],'array')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('sexual_orientation', 'Gender identity','Sexual orientation','Checkbox','Checkbox',ARRAY['Mostly Heterosexual: Attracted to people of the opposite sex',
-- 'Mostly Bisexual: Attracted to people of either sex',
-- 'Mostly Homosexual: Attracted to people of same sex',
-- 'Mostly Pansexual: Attracted to people of any gender identity',
-- 'Mostly Asexual: Not sexually attracted to other people'
-- 'None of these describe me'],'array')
-- INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('ethnicity', 'Ethnicity','general/intake','input','paragraph',ARRAY[''],'string')
INSERT INTO provider_required_questions(question_code, question_label, places_asked, edit_format, display_format,response_options,data_type ) VALUES('accommodations', 'Do you have any accommodations accommodation needs?','intake','Checkbox','Checkbox',ARRAY['Physical accommodations',
'Specific learning accommodations (SLD)','Other health impairment','Autism spectrum disorder (ASD)','Emotional disturbance','Speech or language impairment',
'Visual impairment, including blindness',
'Deafness',
'Hearing impairment',
'Orthopedic impairment',
'Intellectual accommodations'
'Traumatic brain injury',
'None of these describe me',
'I do not need accommodations'],'array')


INSERT INTO provider_org_table(updatedat, provider_name, provider_start_hours, provider_close_hours, provider_phone, provider_hotline, provider_website, provider_instagram, provider_facebook, org_for_who, org_our_services, org_we_are,required_variables_intake, required_variables_general, avatar_colors, provider_ages_served, provider_services_offered, provider_genders_served, provider_other_characteristics, provider_county, provider_address1, provider_address2, provider_address3, email_help, activity_level, created_by) VALUES('2022-08-31', 'New Door Ventures', '9:00', '5:00 PM', '415-596-5924', '', 'https://www.newdoor.org/', '', '', 'Am I eligible? 

Youth most eligible for the program have these things:

Zero to little work experience (0-3 months of work experience)
High job turnover (longest time in a job is 1-3 months or less)
Negative work experience either through termination, going MIA, or quitting a job.
Has Stable-enough housing for 3-6 months
Not enrolled in a traditional high school
Age 16-24
Wants a regular job after completion of the program', 'Employment Program

Three month job training and paid internship program in San Francisco and Oakland. Commitment about 15 hours per week. Earn $18/hour. Support with job placement, career development and postsecondary enrollment after internship. Must be eligible to work in the U.S.

Education Program

Earn high school equivalency diploma (GED or HiSET). Get paid $15/hour to attend class and study.  In person only, in San Francisco. Most youth complete GED/HiSet within 7 months. Must be eligible to work in the U.S.', 'VALUES
Youth: Youth are assets to our community. Their voice is central to our work, and they have the capacity to create their own path of learning and growth.

Work: Jobs are a vital part of the successful transition from youth to adulthood. Work enables learning, growth, and economic sustenance for all people, especially opportunity youth. 

Inclusion, Equity, and Social Justice: Inclusion and equity are the doorways to opportunity for our youth. We strive to create an inclusive, equitable environment for youth and all who wish to join us in our work.

Relationships and Community: We build trusting relationships with our youth and believe that a supportive community is critical for personal and collective growth. Our community partners are fellow catalysts in creating opportunities for youth.

Learning and Excellence: We strive to create profound impact in our work. We are learners in pursuit of excellence for the benefit of young people.

Integrity: We operate with integrity and authenticity. We are thoughtful stewards of all resources entrusted to us.', '{}', '{}', '{}', '{"16 - 24 years old","18 years old and older"}', '{"Workforce Development"}', '{"Gender Non-Binary",Man,"Trans Man",Woman,"Trans Woman"}', '{}', '{"Alameda County","San Francisco County"}', '3221 20th Street, SF, CA 94110', '', '', 'khickey@newdoor.org', '', '')

UPDATE provider_org_table SET provider_id = 15 WHERE provider_name = 'New Door Ventures'
