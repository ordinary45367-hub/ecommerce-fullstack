// Adds a LONG description to every product (used by the product details page).
//
// Put this file in:  scripts/update-descriptions.js
// Run from the project root:
//     node scripts/update-descriptions.js           -> updates the database
//     node scripts/update-descriptions.js --dry     -> only shows what would change
//
// It matches products by exact name and is safe to run more than once.
// Your Product.description column is @db.Text, so long text fits.
import "dotenv/config";
import { prisma } from "../config/prisma.js";

const DESCRIPTIONS = {
  // ---------------------------------------------------------------- Electronics
  "Wireless Bluetooth Earbuds":
    "These true wireless earbuds pair quickly with your phone and come with a charging case that keeps them powered on the go, for up to 24 hours of total battery life. The compact, lightweight fit sits comfortably in the ear for calls, music and podcasts. A great everyday pair for commuting, workouts and travel.",
  "Over-Ear Noise Cancelling Headphones":
    "Soft, padded ear cups and active noise cancellation help you block out traffic, office chatter and engine hum so you can focus on your music or calls. The over-ear design stays comfortable through long listening sessions. A good choice for travel, study and working from home.",
  "Portable Bluetooth Speaker":
    "A water-resistant speaker that delivers full sound with deep bass and runs for up to 12 hours on a single charge. It connects wirelessly to your phone or tablet in seconds and is small enough to toss in a bag. Perfect for the beach, picnics, the garden or a relaxed evening at home.",
  "10000mAh Power Bank":
    "A slim 10000mAh power bank with dual USB output, so you can charge two devices at the same time. It is light enough to carry in a pocket or bag and gives your phone a couple of extra charges when no outlet is nearby. Handy for commuting, travel and long days out.",
  "Smartwatch with Heart Rate Monitor":
    "Keep an eye on your day with step counting, sleep tracking and a built-in heart rate monitor, all on your wrist. Phone notifications let you see calls and messages without reaching for your device. A practical companion for fitness goals and everyday life.",
  "Fitness Tracker Band":
    "A lightweight band that tracks your steps and sleep so you can see how active and rested you are. It is comfortable enough to wear all day and night, with a simple design that suits any outfit. Ideal if you want to build healthier habits without a bulky watch.",
  "4K Action Camera":
    "Capture your adventures in sharp 4K video, with image stabilization that smooths out bumps and movement. The waterproof body is ready for water sports, hiking, cycling and travel. Compact and easy to mount, it is a great way to record your favorite moments.",
  "USB-C Fast Charger 30W":
    "This compact 30W wall charger refuels phones and tablets quickly through a USB-C port. Its small size makes it easy to pack for trips, and it is a handy upgrade over the slow charger that came in the box. Great for home, the office or travel.",
  "Wireless Charging Pad":
    "Place a compatible phone on this Qi-compatible pad and it starts charging, with no cable to plug in each time. The slim design sits neatly on a desk or bedside table. A convenient way to keep your phone topped up through the day and overnight.",
  "Mechanical Gaming Keyboard":
    "Tactile mechanical switches give every keypress a crisp, responsive feel, while the RGB backlight lights up the keys for late-night sessions. The sturdy build is made for fast typing and long gaming marathons. A solid upgrade for gamers, writers and anyone who types a lot.",
  "Wireless Optical Mouse":
    "An ergonomic wireless mouse with adjustable DPI so you can switch between precise and fast cursor movement. It connects without cables for a tidy desk and fits comfortably in the hand through long work days. Works well for office tasks, study and casual browsing.",
  "27-Inch Full HD Monitor":
    "A 27-inch IPS display with Full HD resolution, wide viewing angles and thin bezels that give you more screen and less frame. The HDMI input connects easily to laptops, consoles and desktop computers. Great for working from home, watching movies and gaming.",
  "1080p Webcam with Microphone":
    "Look sharp in video calls with a 1080p webcam that has a built-in microphone, so there is nothing else to set up. Just plug it in and it works with most meeting and streaming apps. A simple upgrade for remote work, online classes and content creation.",
  "Portable SSD 1TB":
    "A pocket-sized solid state drive with 1TB of space and fast file transfers, so large videos, photos and projects move in moments. With no moving parts, it is well suited to being carried around. Ideal for backups, creators and students.",
  "USB Flash Drive 64GB":
    "A compact USB 3.0 flash drive with 64GB of space for documents, photos and backups. Plug it into a laptop or desktop and move files quickly between devices. Small enough to fit on a keychain, it is useful for school, work and travel.",
  "Smart LED Light Bulb 4-Pack":
    "Four Wi-Fi bulbs that you control from an app, with color-changing light to set the mood for movie nights, parties or relaxing evenings. You can adjust brightness and schedule lights from your phone. Energy-efficient LED technology makes them easy to use throughout your home.",
  "Dual Band Wi-Fi Router":
    "A dual band router that spreads a fast, stable signal across your home and has four ports for wired devices such as computers and consoles. Setup is simple, and the two bands help reduce congestion. A reliable choice for streaming, gaming and video calls.",
  "10-Inch Tablet 64GB":
    "A lightweight 10-inch tablet with 64GB of storage for reading, watching videos and browsing the web. The large screen is comfortable for movies and ebooks, and it is easy to carry from room to room. A flexible device for family use, study and travel.",
  "6-Inch E-Reader":
    "A glare-free e-ink screen that reads like paper, with an adjustable backlight for reading at night. It is small and light enough to hold in one hand, and it can store a whole library. A comfortable option for avid readers and travelers.",
  "Aluminum Laptop Stand":
    "This adjustable aluminum stand raises your laptop to a more comfortable viewing height and lets air flow underneath to help keep it cool. The sturdy build stays stable while you type. A simple way to improve your posture and tidy your desk.",
  "HDMI Cable 2m":
    "A 2-meter high-speed HDMI cable that supports 4K video, so you can connect a TV, monitor, console or streaming box with a clear picture and sound. The length gives you flexibility when setting up your entertainment area. Simple, dependable and ready to use.",
  "Indoor Security Camera":
    "Keep an eye on your home with a 1080p Wi-Fi camera that has night vision and motion alerts sent to your phone. Set it on a shelf or mount it on a wall and check in whenever you like. Useful for watching entrances and living areas, and for peace of mind.",
  "Wired Over-Ear Gaming Headset":
    "A stereo headset with padded ear cups and a boom microphone so you can hear every detail and talk clearly with your team. The wired connection means no batteries to charge, and the comfortable fit works for long sessions. Great for gaming, calls and online classes.",
  "Bluetooth Soundbar 2.1":
    "Upgrade your TV sound with a slim soundbar and wireless subwoofer that add clearer dialogue and deeper bass. Bluetooth lets you stream music from your phone too. It is easy to set up under a TV and suits movies, sports and music.",
  "Compact Digital Camera 20MP":
    "A pocket-sized point-and-shoot with a 20MP sensor and 5x optical zoom, so you can capture detailed photos from near and far. It is simple to use right out of the box and light enough to take anywhere. Great for travel, family events and casual photography.",
  "Instant Print Camera":
    "Take a photo and watch it print in seconds, making it easy to share memories at parties, trips and family gatherings. The simple controls mean anyone can use it. A fun gift for photo lovers who enjoy holding their pictures in their hands.",
  "Drone with HD Camera":
    "A foldable beginner drone with a stable hover and an HD camera for aerial photos and video. The compact folding design fits in a bag, and the simple controls are friendly for first-time pilots. Great for hobby flying, travel clips and learning the basics.",
  "Mini Projector 1080p":
    "Turn any wall into a big screen with a portable 1080p projector that works for movies, games and presentations. Its small size makes it easy to move between rooms or take to a friend's house. Ideal for movie nights, small meetings and outdoor viewing.",
  "Wireless Gaming Controller":
    "An ergonomic controller with a rechargeable battery, so you can play without cables getting in the way. The comfortable grip and responsive buttons are made for long gaming sessions. A useful second controller for multiplayer games or a replacement for a worn one.",
  "Handheld Retro Game Console":
    "Relive classic games with a portable console that comes with a collection of built-in titles, so there is nothing to download. It fits easily in a bag for car rides, trips and breaks. A nostalgic gift for retro fans and a simple way to keep kids entertained.",
  "Noise Isolating Wired Earphones":
    "In-ear earphones with a 3.5mm plug and an inline microphone for calls. The snug fit helps block outside noise, and the wired connection needs no charging. A reliable, affordable choice for commuting, the gym and everyday listening.",
  "Smart Speaker with Voice Assistant":
    "Ask for music, timers and answers hands-free with a voice-controlled speaker that also works with compatible smart home devices. The compact design fits on a shelf or kitchen counter and fills a room with clear sound. A handy hub for kitchens and living rooms.",
  "Digital Alarm Clock Radio":
    "A clock radio with a bright LED display and dual alarms, so two people can wake at different times. Wake up to the radio or an alarm, and read the time easily from across the room. A simple, dependable addition to any bedside table.",
  "Rechargeable AA Batteries 8-Pack":
    "Eight long-life NiMH AA batteries you can recharge again and again, which saves money and reduces waste compared with disposable ones. They come in a storage case that keeps them organized. A practical choice for remotes, toys, flashlights and game controllers.",
  "Surge Protector Power Strip":
    "A 6-outlet power strip with USB ports and a master switch that helps protect your electronics from power surges. Charge phones and plug in several devices from one spot. A tidy solution for desks, TV stands and home offices.",
  "Portable Mini Fan USB":
    "A rechargeable handheld fan with three speeds that keeps you cool on hot days. Small and light, it fits in a bag or on a desk and charges through USB. Great for commuting, travel, outdoor events and the office.",
  "Ergonomic Vertical Mouse":
    "A vertical mouse that holds your hand in a natural handshake position, which helps reduce wrist strain during long hours at the computer. It tracks smoothly and feels comfortable in the hand. A helpful option for office workers, designers and students.",
  "Drawing Tablet 10-Inch":
    "A pressure-sensitive pen tablet with a 10-inch drawing area for sketching, digital painting and photo editing. The pen responds to light and firm strokes for natural line work. A great starting point for artists, designers and students.",
  "Bluetooth Keyboard Slim":
    "A slim wireless keyboard that connects to several devices and lets you switch between them, so you can type on a tablet, phone or laptop. Its low profile is comfortable for everyday writing and light enough to carry. Useful for travel, study and working on the go.",
  "Laser Printer Monochrome":
    "A fast black-and-white laser printer with Wi-Fi, so you can print from computers and phones without cables. Laser printing produces sharp text and is well suited to documents, reports and school work. A dependable choice for home offices and small businesses.",
  "Selfie Stick Tripod":
    "An extendable selfie stick with a Bluetooth remote that also works as a tripod, so you can take group photos, vlogs and videos hands-free. It packs down small and fits in a bag. A handy accessory for travel and social media.",
  "Digital Kitchen Scale":
    "Measure ingredients precisely with an LCD display and a tare function that lets you weigh each item in the same bowl. The compact scale stores easily in a drawer. Helpful for baking, portion control and everyday cooking.",

  // --------------------------------------------------------- Clothing & Apparel
  "Men's Cotton Crew Neck T-Shirt":
    "A soft cotton t-shirt in a classic crew neck fit that stays breathable through the day. The simple design pairs with jeans, shorts or under a jacket. A wardrobe staple that works for casual outings, travel and layering.",
  "Women's Slim Fit Jeans":
    "Stretch denim gives these slim fit jeans a flattering shape while still letting you move comfortably. The classic cut goes with tops, sweaters and boots. An easy everyday pair for work, weekends and nights out.",
  "Men's Hooded Fleece Sweatshirt":
    "A warm fleece-lined hoodie with a roomy kangaroo pocket for your hands or small items. It layers easily under a jacket or works on its own on cool days. A comfortable choice for casual wear, travel and relaxing at home.",
  "Women's Summer Floral Dress":
    "A lightweight knee-length dress with a floral print that feels cool and easy to wear in warm weather. The flowing shape is comfortable all day and dresses up with sandals or down with sneakers. Lovely for picnics, brunches and holidays.",
  "Men's Classic Denim Jacket":
    "A durable denim jacket with a button front and a classic look that never goes out of style. It layers over t-shirts and hoodies and gets better with wear. A versatile piece for spring and autumn outfits.",
  "Women's Wool Blend Winter Coat":
    "An insulated long coat made from a warm wool blend that keeps the cold out on winter days. The longer length adds extra coverage and a polished look. A dependable cover-up for commuting, travel and dressing up.",
  "Unisex Running Sneakers":
    "Cushioned, lightweight sneakers designed for daily runs and everyday wear. The soft cushioning absorbs impact, and the breathable build keeps feet comfortable. A good choice for jogging, gym sessions and walking.",
  "Leather Casual Belt":
    "A genuine leather belt with a sturdy metal buckle that works with jeans, chinos and casual trousers. The leather softens with use and holds its shape. A simple, long-lasting accessory for everyday outfits.",
  "Men's Chino Pants":
    "Versatile cotton chinos with a clean, tailored look that works for the office and the weekend. They are comfortable to wear all day and pair with shirts, polos and sneakers. A smart-casual essential.",
  "Women's Yoga Leggings":
    "High-waist stretch leggings that move with you in yoga, workouts or while you lounge at home. The waistband stays in place and the stretchy fabric is comfortable through every pose. Easy to wear to the gym or around town.",
  "Cotton Ankle Socks 6-Pack":
    "Six pairs of breathable cotton ankle socks with a reinforced heel for added durability. They stay comfortable inside sneakers and everyday shoes. A practical multi-pack for work, school and workouts.",
  "Knit Winter Beanie":
    "A warm stretch-knit beanie that fits snugly and keeps your head and ears covered on cold days. It is soft, light and easy to pack. A simple winter essential for commuting, walks and outdoor sports.",
  "Wool Blend Scarf":
    "A soft, long scarf in a classic pattern that wraps around the neck for extra warmth. The wool blend feels cozy and works with coats and jackets. Great for cold weather, and it makes a thoughtful gift.",
  "Leather Winter Gloves":
    "Lined leather gloves that keep your hands warm, with touchscreen fingertips so you can use your phone without taking them off. The soft lining adds comfort and the leather gives a refined look. Ideal for winter commutes and travel.",
  "Adjustable Baseball Cap":
    "A cotton twill cap with a curved brim that shades your eyes from the sun. The adjustable fit suits most heads and the casual style goes with almost everything. Perfect for sports, travel and sunny days.",
  "Men's Button-Down Oxford Shirt":
    "A long-sleeve cotton shirt with a button-down collar and a smart-casual look. The Oxford weave feels comfortable and holds up to regular wear. Wear it tucked in at work or open over a t-shirt on weekends.",
  "Women's Knit Cardigan Sweater":
    "A cozy open-front cardigan with pockets that adds warmth without bulk. Throw it over dresses, tees or blouses for an easy layered look. A comfortable favorite for cool days at home, at work or on the go.",
  "Waterproof Rain Jacket":
    "A packable hooded jacket that keeps you dry in rain and wind and folds small enough for a bag or backpack. The hood adds extra protection when the weather turns. A smart pick for commuting, hiking and travel.",
  "Men's Polo Shirt":
    "A classic piqu\u00e9 polo with a ribbed collar that looks neat and stays comfortable. It works for casual Fridays, weekend outings and sports like golf. An easy, versatile option for warm weather.",
  "Women's Leather Ankle Boots":
    "Stylish ankle boots with a low block heel that is comfortable for walking. The leather finish pairs with jeans, skirts and dresses. A versatile pair for autumn and winter, and for dressing up.",
  "Men's Leather Dress Shoes":
    "Polished lace-up shoes made for formal occasions, from interviews to weddings. The leather has a refined look and a comfortable fit for long days. A dependable pair for work and special events.",
  "Cotton Pajama Set":
    "A two-piece sleepwear set in soft cotton that feels gentle on the skin and stays breathable overnight. The relaxed fit makes it easy to sleep or lounge. A comfortable choice for home and a nice gift.",
  "Polarized Sunglasses":
    "UV400 protective lenses with polarization reduce glare from roads and water, while a durable frame holds up to daily use. They are lightweight and comfortable to wear. Great for driving, the beach and everyday sun protection.",
  "Women's Crew Neck Sweater":
    "A soft knit sweater in a relaxed fit that feels warm and comfortable. The crew neck layers well over collared shirts or under coats. An easy staple for cool weather.",
  "Men's Cargo Shorts":
    "Cotton cargo shorts with multiple pockets for your phone, wallet and keys. The relaxed fit is comfortable for summer days and outdoor activities. A practical pick for travel, hiking and weekends.",
  "Women's Denim Shorts":
    "High-rise denim shorts with a frayed hem and a casual summer look. The high waist is flattering and pairs with tees, tanks and sandals. A classic for warm days and holidays.",
  "Men's Leather Wallet":
    "A bifold leather wallet with card slots and space for cash, designed to slip into a pocket without bulk. The leather feels durable and develops character with age. A practical everyday carry and a good gift.",
  "Women's Leather Handbag":
    "A spacious shoulder bag with a zip closure that keeps your belongings secure. It has room for a phone, wallet, keys and daily items, and the leather finish suits work or casual outfits. A reliable everyday bag.",
  "Canvas Backpack":
    "A durable everyday backpack with a padded laptop sleeve to protect your computer. The canvas material is sturdy and the roomy main compartment holds books, clothes and gear. Suited to school, work and weekend trips.",
  "Men's Wool Suit Jacket":
    "A tailored single-breasted blazer made for formal wear, giving you a sharp, structured look. It is easy to pair with dress trousers or smart jeans. A solid choice for interviews, meetings and special occasions.",
  "Silk Necktie":
    "A classic woven tie in a solid color that goes with most shirts and suits. The silk has a smooth finish and ties neatly. A timeless accessory for the office, weddings and formal events.",
  "Women's Silk Scarf":
    "A lightweight printed scarf that adds color to any outfit in every season. Wear it around the neck, in your hair or tied to a handbag. A versatile accessory and a lovely gift.",
  "Men's Flannel Shirt":
    "A brushed cotton plaid shirt that feels soft and warm on cool days. Wear it buttoned up or open over a tee. A comfortable go-to for autumn, camping and casual weekends.",
  "Women's Casual Sandals":
    "Cushioned sandals with adjustable straps for a secure, comfortable fit. They are easy to slip on and suit warm weather outings. Great for beach days, errands and relaxed summer outfits.",
  "Men's Slip-On Loafers":
    "Comfortable leather loafers that slip on easily, with a neat look for work or leisure. The cushioned fit makes them good for all-day wear. A smart pair for the office, dinners and travel.",
  "Women's Canvas Sneakers":
    "Classic low-top canvas shoes with a lightweight feel and a casual style. They go with jeans, shorts and dresses. An easy everyday pair for walking, school and weekends.",
  "Men's Swim Trunks":
    "Quick-dry trunks with a mesh lining for comfort in and out of the water. The lightweight fabric dries fast after a swim. A practical choice for the pool, beach and holidays.",
  "Women's One-Piece Swimsuit":
    "A supportive swimsuit with a flattering cut that stays comfortable for swimming and lounging. The stretch fabric moves with you. A reliable pick for the pool, beach and training.",
  "Men's Thermal Underwear Set":
    "A base layer top and bottoms that trap warmth close to the body in cold weather. Wear it under jeans, work trousers or outdoor gear. A smart pick for winter commutes, skiing and camping.",
  "Unisex Wool Fedora Hat":
    "A structured felt hat with a ribbon band and a classic shape that finishes an outfit. It looks smart with coats and casual wear alike. A stylish accessory for cooler months and special occasions.",
  "Women's Trench Coat":
    "A belted, water-resistant coat in classic beige that works for rainy days and cool weather. The belt shapes the waist and the length adds coverage. A timeless layer for work, travel and city wear.",
  "Men's Wristwatch Classic":
    "A stainless steel analog watch with a leather strap and a clean, classic dial. It is easy to read and goes with both casual and formal outfits. A dependable everyday watch and a popular gift.",
  "Compact Folding Umbrella":
    "A windproof umbrella that folds small enough to fit in a bag, so it is there when the rain starts. The sturdy frame handles breezy days. A handy companion for commuting and travel.",

  // ------------------------------------------------------------ Home & Kitchen
  "Non-Stick Frying Pan 12-Inch":
    "A 12-inch pan with even-heating construction and an easy-clean non-stick coating, so food releases easily with little oil. The roomy surface cooks eggs, pancakes, stir-fries and more. A kitchen essential for everyday meals.",
  "Stainless Steel Cookware Set 10-Piece":
    "A ten-piece set of pots, pans and lids that covers everyday cooking, from boiling pasta to simmering sauces. Stainless steel is durable and easy to maintain. A great starter set for a new home or a refresh of an old kitchen.",
  "Electric Kettle 1.7L":
    "A 1.7-liter kettle that boils water fast and shuts off automatically when it is done. The generous size makes tea, coffee, instant noodles and more quick. A practical appliance for kitchens, offices and dorm rooms.",
  "12-Cup Drip Coffee Maker":
    "Brew up to 12 cups with a programmable coffee maker that has a warming plate to keep coffee hot. Set it up the night before and wake up to fresh coffee. A great choice for families, offices and gatherings.",
  "1000W Countertop Blender":
    "A powerful 1000W motor blends smoothies, sauces and soups smoothly, and it handles ice too. The large jug makes batches for the whole family. A versatile kitchen helper for healthy drinks and quick meals.",
  "Air Fryer 5.8 Qt":
    "Cook crispy fries, chicken, vegetables and more with little or no oil in a 5.8-quart air fryer. Hot circulating air gives a golden finish with less mess. A convenient way to prepare quick meals for the family.",
  "2-Slice Toaster":
    "A two-slice toaster with browning control so you can choose light or dark toast, plus a removable crumb tray for easy cleaning. It heats evenly and sits neatly on the counter. A breakfast basic for any kitchen.",
  "8-Inch Chef's Knife":
    "A sharp 8-inch stainless steel blade with an ergonomic handle that is comfortable for chopping, slicing and dicing. The balanced feel makes prep work faster. A must-have knife for home cooks.",
  "Wooden Cutting Board":
    "A sturdy bamboo cutting board with a juice groove that catches liquids from fruit and meat. The surface is gentle on knives and easy to clean. Useful for chopping, serving and as a cheese board.",
  "Glass Food Storage Containers 10-Piece":
    "Ten leak-proof glass containers with snap lids keep leftovers and meal prep fresh. Glass does not hold onto stains or odors, and the lids lock for safe transport. A tidy, reusable solution for lunches and the fridge.",
  "Ceramic Dinnerware Set 16-Piece":
    "A 16-piece set of plates and bowls that serves four people. The ceramic has a smooth, glossy finish and stacks neatly in the cupboard. A good choice for everyday meals, guests and a first apartment.",
  "Cotton Bed Sheet Set Queen":
    "Soft, breathable cotton sheets with deep pockets that fit mattresses snugly. The set is made for a queen bed and feels comfortable all night. An easy way to refresh your bedroom.",
  "Memory Foam Pillow 2-Pack":
    "Two supportive pillows that contour to your head and neck and keep their shape night after night. The memory foam feels cushioned and comfortable. A cozy upgrade for better rest.",
  "Microfiber Comforter":
    "A lightweight all-season comforter that is soft to the touch and warm without being heavy. The microfiber is easy to care for and fluffs up well. A cozy layer for any bed, in any season.",
  "LED Desk Lamp":
    "An adjustable desk lamp with several brightness levels so you can set the right light for reading, studying or working. The LED bulb is energy efficient and stays cool. A bright idea for desks and bedside tables.",
  "Robot Vacuum Cleaner":
    "A self-navigating robot vacuum that cleans floors and carpets while you do other things. It moves around furniture and covers the room on its own. A time-saving helper for daily dust and crumbs.",
  "Bath Towel Set 6-Piece":
    "Six absorbent cotton towels in a coordinated set that dry quickly and feel soft on the skin. The set covers the whole family's bathroom needs. A good pick for your home or as a housewarming gift.",
  "Shower Curtain with Hooks":
    "A water-repellent curtain that keeps water inside the tub and comes with 12 hooks, so you can hang it right away. The fabric is easy to wipe clean. A simple way to refresh your bathroom.",
  "Electric Pressure Cooker 6 Qt":
    "A multi-function 6-quart cooker that cooks stews, rice, beans and soups much faster than a regular pot. Pressure cooking keeps flavors rich and saves time on busy days. A smart appliance for families and meal prep.",
  "Dish Drying Rack":
    "A two-tier rack with a utensil holder that organizes plates, bowls and cutlery while they air dry. Water drains away from the dishes, which keeps counters tidier. A useful addition to small and large kitchens.",
  "Laundry Basket":
    "A sturdy, ventilated basket with handles that makes carrying clothes easy. The open design lets air circulate, keeping clothes fresher. A practical helper for the bedroom, bathroom and laundry room.",
  "Scented Candle Gift Set":
    "A gift set of soy wax candles in assorted fragrances that fill the room with a warm glow and a pleasant scent. Light them for a relaxing evening, a bath or a cozy dinner. A thoughtful present for birthdays and holidays.",
  "Cast Iron Skillet 10-Inch":
    "A pre-seasoned 10-inch cast iron skillet that goes from stovetop to oven. It holds heat well for searing, frying and baking, and lasts for years with proper care. Great for steaks, cornbread and one-pan meals.",
  "Stand Mixer 5 Qt":
    "A tilt-head mixer with a 5-quart bowl, dough hook and whisk for kneading, whipping and mixing with little effort. The tilt head makes it easy to add ingredients and swap attachments. A baker's best friend for bread, cakes and cookies.",
  "Rice Cooker 5-Cup":
    "An automatic rice cooker that makes fluffy rice at the press of a button and keeps it warm until you are ready to eat. The 5-cup size suits small and medium families. A simple, reliable way to cook rice.",
  "Slow Cooker 6 Qt":
    "A programmable 6-quart slow cooker with a glass lid that lets you see your food as it cooks. Add ingredients in the morning and come home to a ready meal. Ideal for soups, stews and family dinners.",
  "Microwave Oven 20L":
    "A compact 20-liter microwave with 10 power levels for reheating, defrosting and cooking. The small size fits on counters and in dorm rooms and apartments. A convenient appliance for quick meals.",
  "Waffle Maker":
    "A non-stick waffle maker that cooks golden, crisp waffles in minutes and cleans up easily. Use it for breakfast, brunch or dessert. A fun way to treat the family at the weekend.",
  "Manual Citrus Juicer":
    "A hand-press juicer that squeezes fresh juice from lemons and limes with little effort. It needs no electricity and is easy to rinse and store. Useful for drinks, dressings and cooking.",
  "Stainless Steel Mixing Bowls Set":
    "A nesting set of stainless steel bowls in assorted sizes for mixing, whisking and serving. They stack to save space and are durable and easy to clean. A kitchen staple for baking and meal prep.",
  "Silicone Baking Mat 2-Pack":
    "Two reusable non-stick mats that line baking sheets so food slides off easily. They replace parchment paper and are simple to wash. Great for cookies, pastries and roasting vegetables.",
  "Glass Teapot with Infuser":
    "A heat-resistant glass teapot with an infuser for brewing loose-leaf tea. You can watch the leaves unfurl as the tea steeps. A lovely choice for tea lovers and for serving guests.",
  "Wine Glasses Set of 6":
    "Six clear stemmed glasses suitable for red or white wine. The elegant shape is comfortable to hold and suits dinners and celebrations. A good set for entertaining at home.",
  "Ceramic Coffee Mugs Set of 4":
    "Four 12 oz ceramic mugs in assorted colors that are microwave-safe for reheating. The comfortable handles and generous size are great for coffee, tea or hot chocolate. A cheerful set for home or the office.",
  "Stainless Steel Cutlery Set 24-Piece":
    "A 24-piece set of mirror-polished forks, knives and spoons for the table. Stainless steel resists rust and looks sharp at every meal. A solid everyday cutlery set for any home.",
  "Electric Hand Mixer":
    "A 5-speed hand mixer that comes with beaters and dough hooks for whipping cream, beating eggs and mixing batter. It is lightweight and easy to store. A handy tool for cakes, cookies and quick desserts.",
  "Wall Clock Round 12-Inch":
    "A silent quartz clock with a simple 12-inch dial that is easy to read and does not tick loudly. The clean design suits kitchens, bedrooms and offices. A tidy way to keep time in any room.",
  "Decorative Throw Pillows 2-Pack":
    "Two soft cushion covers with hidden zippers that add color and comfort to sofas and beds. The covers are easy to remove and wash. A quick way to refresh a living room.",
  "Floor Lamp Modern":
    "A tall arc lamp with a fabric shade that gives soft, warm light to living rooms and reading corners. The modern shape stands neatly beside a sofa or chair. A stylish way to brighten a room.",
  "Bamboo Storage Basket Set":
    "A set of woven baskets that organizes shelves, closets and bathrooms. The natural bamboo look adds warmth to any space. Handy for towels, toys, blankets and everyday clutter.",
  "Standing Iron and Ironing Board":
    "A steam iron paired with a foldable ironing board for removing wrinkles from shirts, trousers and bedding. The board folds flat for storage. A practical set for busy households.",
  "Potted Artificial Plant":
    "A realistic faux plant in a ceramic pot that adds greenery without watering or sunlight. It looks natural on shelves, desks and tables. A low-maintenance way to brighten a room.",

  // --------------------------------------------------------- Sports & Outdoors
  "Non-Slip Yoga Mat 6mm":
    "A 6mm cushioned mat with a grippy surface that keeps you steady in yoga, Pilates and stretching. The extra thickness protects knees and joints on hard floors. Easy to roll up and carry.",
  "Adjustable Dumbbell Set 20kg":
    "A space-saving dumbbell set with adjustable weights, so you can change the load as you get stronger. It replaces a whole rack of fixed dumbbells in one small footprint. Great for home workouts and strength training.",
  "Resistance Bands Set 5-Piece":
    "Five latex bands in different resistance levels for strength, stretching and rehab exercises. They are light, portable and gentle on joints. A flexible way to work out at home, at the gym or while traveling.",
  "Speed Jump Rope":
    "An adjustable rope with ball-bearing handles that spin smoothly for fast, tangle-free jumping. Adjust the length to fit your height. A simple, effective tool for cardio, boxing and warm-ups.",
  "Insulated Stainless Steel Water Bottle 32oz":
    "A 32-ounce stainless steel bottle with insulation that keeps drinks cold for 24 hours. The large size means fewer refills during the day. A durable, reusable bottle for the gym, hikes and school.",
  "4-Person Camping Tent":
    "A weather-resistant tent with easy setup that sleeps four people. It gives shelter from wind and rain and is simple to pitch. A good choice for family camping, festivals and weekend trips.",
  "3-Season Sleeping Bag":
    "A warm, compact sleeping bag for spring, summer and fall that packs into a carry sack. It is light enough for hiking and cozy enough for chilly nights. A good choice for camping and sleepovers.",
  "40L Hiking Backpack":
    "A 40-liter pack with a ventilated back panel and a rain cover for day hikes and short trips. The roomy compartments hold clothes, food and gear. A comfortable carry for trails and travel.",
  "Trekking Poles Pair":
    "A pair of lightweight adjustable poles with cork grips that reduce strain on the knees and improve balance on hills. Set the height to suit you and pack them away easily. Great for hiking and walking.",
  "Rechargeable LED Headlamp":
    "A bright rechargeable headlamp that frees your hands for camping, running and repairs. The comfortable strap holds it steady and the LED light shines far. A useful light for outdoor adventures and power cuts.",
  "Soccer Ball Size 5":
    "A durable machine-stitched size 5 ball for matches and training. It holds its shape and is made for regular play on grass and turf. A solid choice for teens and adults.",
  "Indoor/Outdoor Basketball":
    "A basketball with a grippy composite leather cover that plays well on indoor courts and outdoor pavement. The deep channels help with ball control. A great ball for practice and pick-up games.",
  "Adult Tennis Racket":
    "A balanced graphite racket with a cover that offers a good blend of power and control. The comfortable grip helps you play longer. A solid option for beginners and club players.",
  "Badminton Set for 4 Players":
    "A complete set with rackets, shuttlecocks and a portable net for four players, so you can play almost anywhere. It sets up in minutes in a garden, park or beach. A fun activity for friends and families.",
  "Adult Cycling Helmet":
    "A ventilated helmet with an adjustable fit that protects your head and keeps you cool on rides. The lightweight shell is comfortable on long journeys. An essential piece of safety gear for road and city cycling.",
  "Portable Bike Pump":
    "A compact pump with a pressure gauge that lets you inflate tires to the right level. It is small enough to carry on rides in case of a flat tire. A helpful tool for commuters and weekend cyclists.",
  "High-Density Foam Roller":
    "A firm foam roller for self-massage that helps ease tight muscles after exercise. Roll it under your back, legs or shoulders to loosen up. A simple recovery tool for runners and gym-goers.",
  "Doorway Pull-Up Bar":
    "A no-screw bar that fits in a doorway for pull-ups, chin-ups and other upper body exercises. It sets up quickly and comes down when you are done. A simple way to build strength at home.",
  "Running Armband Phone Holder":
    "A sweat-resistant armband that holds your phone securely while you run, so your hands stay free. The adjustable strap fits comfortably. Great for jogging, walking and the gym.",
  "Fishing Rod and Reel Combo":
    "A telescopic rod with a spinning reel that is ready to fish out of the box. It collapses to a short length for easy transport. A great set for beginners and for casual trips to the lake or sea.",
  "Folding Camping Chair":
    "A portable chair with a cup holder and carry bag that folds flat for storage. The comfortable seat is great for campsites, sports fields and picnics. A handy seat to keep in the car.",
  "Anti-Fog Swim Goggles":
    "Comfortable goggles with an anti-fog coating and UV protection, giving you a clear view in the pool. The adjustable strap seals gently around the eyes. A good choice for lap swimming and training.",
  "Kettlebell 12kg":
    "A cast iron kettlebell with a wide handle for swings, squats and presses. The 12kg weight is a good starting point for strength and cardio training. A versatile tool for home workouts.",
  "Barbell Weight Plates Set":
    "Cast iron plates for home gym barbells that let you add load as you progress. The durable material stands up to regular lifting. A good addition to a strength training setup.",
  "Adjustable Weight Bench":
    "A foldable bench with flat and incline positions for presses, rows and other exercises. The padded seat is comfortable and it folds away to save space. A practical piece for a home gym.",
  "Boxing Gloves 12oz":
    "Padded 12 oz training gloves with wrist support for bag work and sparring. The cushioning helps protect your hands. A solid choice for boxing, kickboxing and fitness classes.",
  "Heavy Punching Bag":
    "A hanging heavy bag for boxing, kickboxing and martial arts practice. Hit it to build power, speed and endurance. A great way to burn energy and train at home or in a gym.",
  "Ping Pong Paddle Set":
    "Two paddles and balls for table tennis, ready for games at home, in the office or at the club. The rubber surface gives good grip and spin. A fun, easy set for beginners and families.",
  "Volleyball Official Size":
    "A soft-touch official-size volleyball for indoor and beach play. The comfortable cover is gentle on the hands for passing and serving. Ideal for practice, games and holidays.",
  "American Football Youth Size":
    "A durable composite football sized for youth leagues, with a grippy surface for throwing and catching. It holds up to regular play. A good choice for practice and backyard games.",
  "Baseball Glove Adult":
    "A leather fielding glove with a padded palm that cushions catches. The leather breaks in with use for a custom fit. A reliable glove for practice and games.",
  "Wooden Baseball Bat":
    "A solid maple bat for practice and games, with a balanced feel and a sturdy barrel. Maple is a dense wood that gives good pop. A great bat for batting practice and the backyard.",
  "Golf Club Driver":
    "A lightweight driver with a graphite shaft that helps you swing faster and hit longer drives. The large head is forgiving. A solid club for beginners and weekend golfers.",
  "Roller Skates Inline Adjustable":
    "Adjustable inline skates with ABEC bearings that roll smoothly and adjust in size as feet grow. The adjustable fit makes them a good choice for young skaters. A fun way to get outdoors and exercise.",
  "Skateboard Complete 31-Inch":
    "A complete 31-inch skateboard with a maple deck, ready to ride for cruising and learning tricks. The sturdy deck is built for regular use. A great starter board for skate parks and the street.",
  "Mountain Bike Gloves":
    "Padded gloves that improve grip and absorb vibration on rough trails. The comfortable fit and breathable design suit long rides. Useful for mountain biking and road cycling.",
  "Camping Cooking Stove":
    "A compact gas stove that is light enough for backpacking and quick to set up. Boil water and cook meals at the campsite. A handy tool for camping and hiking trips.",
  "Inflatable Sleeping Pad":
    "A lightweight insulated mat that adds comfort and warmth under your sleeping bag. It inflates for use and packs small. A smart addition to tent camping and hiking.",
  "Hammock with Tree Straps":
    "A portable nylon hammock for two people that comes with tree straps for quick setup. It packs small and hangs between trees in minutes. A relaxing seat for camping, picnics and the garden.",
  "Binoculars 10x42":
    "Waterproof 10x42 binoculars that bring distant scenes closer with bright, clear views. The rugged build suits outdoor use. A great pair for birdwatching, hiking and sports events.",
  "Kayak Paddle Aluminum":
    "A two-piece aluminum paddle with adjustable length that suits different kayaks and paddlers. It splits for easy transport. A good paddle for lakes, rivers and coastal trips.",
  "Climbing Rope 10mm":
    "A 10mm dynamic rope designed for rock climbing, with stretch to absorb falls. Always inspect it before use and follow safe climbing practices. A core piece of gear for climbers.",

  // ------------------------------------------------------------ Books & Media
  "Mystery Thriller Paperback Novel":
    "A fast-paced paperback mystery full of twists, clues and suspense that keeps you turning pages. Light enough to slip in a bag for commutes and trips. A gripping read for fans of detective stories.",
  "Science Fiction Paperback Novel":
    "A space adventure in paperback that takes you to distant worlds and big ideas. The compact format is easy to carry. A fun pick for sci-fi fans.",
  "Romance Paperback Novel":
    "A heartwarming contemporary romance about love, friendship and second chances. The easy-to-read story is perfect for a cozy weekend. A lovely escape for romance readers.",
  "Fantasy Novel Box Set (3 Books)":
    "An epic fantasy trilogy in a slipcase, giving you three books of adventure, magic and world-building in one set. It looks great on a shelf. A satisfying gift for fantasy lovers.",
  "Historical Biography Hardcover":
    "A well-researched biography in hardcover that explores a life and its times. Detailed and engaging, it is a great read for history fans. A handsome edition for your shelf.",
  "Hardcover Cookbook":
    "An illustrated collection of everyday recipes that makes it easy to plan weeknight dinners and weekend treats. Clear instructions and photos guide you through each dish. A handy cookbook for new and experienced cooks.",
  "Children's Picture Book":
    "A colorful illustrated bedtime story with simple text for young readers. The bright pictures keep little ones engaged. A great book for reading aloud together.",
  "Children's Science Encyclopedia":
    "An illustrated book packed with facts about science and nature for curious kids. Clear explanations and pictures make learning fun. A helpful resource for homework and for exploring.",
  "Illustrated World Atlas":
    "Detailed maps and country facts that help you explore the world from your armchair. Colorful illustrations make it easy to read. A helpful reference for students, travelers and curious minds.",
  "English Dictionary Hardcover":
    "A comprehensive everyday dictionary in hardcover with clear definitions and a wide range of words for school, work and writing. The sturdy cover holds up to daily use on a desk or bookshelf. A handy reference for students, writers and anyone who loves words.",
  "Beginner Python Programming Guide":
    "A step-by-step guide that takes you from your first lines of code to simple programs. Clear examples and exercises help the ideas stick. A good starting point for students and career changers.",
  "Personal Finance Self-Help Paperback":
    "A practical guide to budgeting, saving and building good money habits. Easy-to-follow advice helps you plan for the future. A helpful read for students and families.",
  "Graphic Novel Collection":
    "An illustrated story collection that combines art and storytelling in one volume. The visuals bring each chapter to life. A great pick for comic and graphic novel fans.",
  "Adult Coloring Book":
    "A book of detailed designs for relaxation and creativity. Color at your own pace with pencils or markers. A calming hobby for evenings and weekends.",
  "Hardcover Lined Journal":
    "A notebook with an elastic closure and ribbon marker that keeps your place. The hardcover protects the pages in a bag. Great for journaling, notes and daily planning.",
  "A4 Sketchbook":
    "A sketchbook with heavyweight paper that holds up to pencil, pen and light washes. The large A4 pages give plenty of room for drawing. A good companion for artists and students.",
  "Mathematics Practice Workbook":
    "A workbook with exercises and answers so students can practice and check their work. Regular practice builds confidence with numbers. A useful tool for homework and revision.",
  "Vinyl Record Turntable":
    "A belt-drive turntable with built-in speakers that lets you play records right out of the box. The classic design adds charm to any room. A great way to enjoy vinyl.",
  "Classic Rock Vinyl LP":
    "A 180g pressing of a classic rock album that brings out the warmth of vinyl sound. The heavy disc feels solid and plays well. A great addition for collectors and music fans.",
  "Clip-On LED Book Light":
    "A rechargeable reading light that clips onto books and e-readers, so you can read in bed without disturbing others. The warm, even light is easy on the eyes. A handy light for night readers.",
  "Metal Bookends Pair":
    "Heavy-duty non-slip bookends that hold books upright on shelves and desks. The sturdy metal keeps stacks steady. A tidy way to organize books and papers.",
  "Movie Blu-ray Box Set":
    "A three-film collection on Blu-ray with sharp picture and sound. Great for movie nights and for collectors. A box set that looks good on a shelf.",
  "Horror Paperback Novel":
    "A chilling page-turner in paperback that builds dread and suspense chapter by chapter. The compact format is easy to carry, and the story is made for late-night reading with the lights low. A good choice for horror fans who like to be unsettled.",
  "Poetry Collection Paperback":
    "Selected poems from modern writers that explore life, love and the world. The compact paperback is easy to carry. A rewarding read for poetry lovers.",
  "World History Hardcover":
    "An illustrated overview of world history that covers major events and civilizations. Clear writing and pictures make the past easy to follow. A good reference for students and curious readers.",
  "Travel Guide Europe":
    "Itineraries, maps and tips that help you plan a trip across Europe. Practical advice makes it easier to get around. A handy guide for first-time and frequent travelers.",
  "Gardening for Beginners Book":
    "A step-by-step guide to growing vegetables and flowers at home. Learn about soil, planting and care with easy explanations. A good start for new gardeners.",
  "Photography Basics Guide":
    "Learn composition, light and camera settings in plain language. Clear examples help you take better photos. A helpful guide for beginners with a phone or camera.",
  "Classic Literature Hardcover Collection":
    "A leather-look edition of timeless stories that looks elegant on a shelf. Read the classics in a collectible format. A lovely gift for book lovers.",
  "Children's Chapter Book Set":
    "Four illustrated chapter books for young readers who are ready for longer stories. The pictures and short chapters build reading confidence. A great set for home and school.",
  "Language Learning Phrasebook":
    "A pocket phrasebook with a pronunciation guide that helps you speak common phrases while traveling. Compact enough for a bag. A useful companion for trips and beginners.",
  "Learn Chess Strategy Book":
    "Openings, tactics and endgames explained in clear steps, with practice ideas that help you improve your play. Each section builds on the last, so you can learn at your own pace. A good book for beginners and improving players who want to play with more confidence.",
  "Spiral Notebook 5-Pack":
    "Five college-ruled notebooks in assorted colors for class notes, lists and ideas. The spiral binding lets pages lie flat. A practical multipack for school and work.",
  "Fountain Pen Set":
    "A refillable fountain pen with ink cartridges for smooth, expressive writing. The classic design feels good in the hand. A lovely gift for students and writers.",
  "Colored Pencils 48-Pack":
    "Forty-eight vibrant pencils in a tin case for coloring and drawing. The wide range of shades gives plenty of choice. A good set for artists and kids.",
  "Watercolor Paint Set":
    "A palette of 24 colors with a brush for painting. The bright colors blend easily and are good for beginners. A fun set for art classes and hobbyists.",
  "Desk Organizer Wooden":
    "A wooden organizer with compartments for pens, notes and cards. It keeps small items tidy on the desk. A neat addition to home offices and study spaces.",
  "Sticky Notes Assorted 12-Pack":
    "A 12-pack of colorful removable notes for reminders, lists and bookmarks. The sticky backing holds firmly yet lifts off cleanly without leaving marks. Great for school, work and home, and handy for color-coding your tasks.",
  "Acoustic Guitar Beginner":
    "A full-size guitar with a strap and picks that gets you playing right away. The comfortable neck is good for learning chords. A good starter instrument for new players.",
  "Ukulele Soprano":
    "A compact four-string instrument that is easy to learn and fun to play. Its small size is good for travel and beginners. A cheerful instrument for songs with friends and family.",
  "Jigsaw Puzzle 1000 Pieces":
    "A scenic landscape puzzle with 1000 pieces for family fun or quiet evenings. Take your time and enjoy the satisfying picture. A relaxing activity for puzzle fans.",
  "Classic Board Game Chess Set":
    "A wooden chessboard with weighted pieces that feel solid and stay in place. The classic design suits beginners and experienced players. A timeless game for family nights and clubs.",
};

async function main() {
  const dry = process.argv.includes("--dry");
  const entries = Object.entries(DESCRIPTIONS);
  let updated = 0;
  const notFound = [];

  for (const [name, description] of entries) {
    if (dry) {
      const count = await prisma.product.count({ where: { name } });
      if (count === 0) notFound.push(name);
      else updated += count;
      continue;
    }
    const result = await prisma.product.updateMany({
      where: { name },
      data: { description },
    });
    if (result.count === 0) notFound.push(name);
    else updated += result.count;
  }

  // Products in the database that have no long description in this file
  const known = new Set(Object.keys(DESCRIPTIONS));
  const all = await prisma.product.findMany({ select: { name: true } });
  const without = all.filter((p) => !known.has(p.name)).map((p) => p.name);

  console.log(dry ? "DRY RUN (nothing was changed)" : "Done.");
  console.log(`Descriptions in this file: ${entries.length}`);
  console.log(
    `${dry ? "Products that would be updated" : "Products updated"}: ${updated}`,
  );
  if (notFound.length)
    console.log(
      `Names not found in the database (${notFound.length}):\n  - ${notFound.join("\n  - ")}`,
    );
  if (without.length)
    console.log(
      `Products with no long description here (${without.length}):\n  - ${without.join("\n  - ")}`,
    );
}

main()
  .catch((e) => {
    console.error("Failed:", e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
