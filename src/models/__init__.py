

""" 
User
--
user_id integer PK
email string unique
password string


FollowUp
--
Expiration_date_id integer PK
user_id integer FK > - User.user_id
errand_name string
status string
expiration_date date


ErrandTypes
------------
type_id integer PK
name enum
description string


Errand
--
errands_id integer PK
type_id integer FK > - ErrandTypes.type_id
offices_id FK > - Offices.offices_id
name string
description string
instructions string
requirements string
country string
city string

Offices
--
offices_id integer PK
street_name string
CP integer
coordinates string


Favorites
--
favorites_id integer PK
user_id integer FK > - User.user_id
errands_id integer FK > - Errands.errands_id
 """
