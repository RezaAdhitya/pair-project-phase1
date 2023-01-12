## Project member:
  1. Reza
  2. Ika
  
## Theme: 
E-commerce

## MVP Feature: 
Multer

## Pages:
- navbar (Home, Categories, Cart, profile, login/logout)
- Landing page (ada tombol login dan register)
- Category List
- Product List (kalo role = seller, bisa add, edit, dan delete product)
- Cart (role access = admin & customer)
- Profile page
- Profile edit (delete cuma admin)
- Product Add (role access = admin & seller)
- Product Edit (role access = admin & seller)

# Change Log

|No| Changes | Notes |
|--|---------|-------|
|1| Setting up back-end #1 | <ul><li>create db</li><li>migrating tables</li><li>setting relationship</li><li>migrating tables</li><li>seeding</li></ul> |
|2| View templates #2 | <ul><li>View templates</li><li>Edit addNewColumnIsPaidInCart -> change data type from integer to boolean</li><li>User data and seeding (for base admin account)</li></ul> |
|3| Routing #3 | <ul><li>Added routing</li><li>Added Bcryptjs to User model</li><li>updated ERD image (refer to ERDTim8v3.png)</li><li>Added migrations for imageUrl (Products table) and amount (Carts table)</li></ul> |
