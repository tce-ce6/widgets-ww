{
  "widget": {
    "id": "en_geo_10_wg83",
    "title": "Major Soil Types",
    "instruction": "Tap one soil type to explore.",
    "mapImage": "assets/maps/india_blank.png",
    "soils": [
      {
        "id": "mountain",
        "name": "Mountain Soil",
        "soilImage": "assets/soils/mountain.jpg",
        "mapHighlightColor": "#8B6F47",
        "distributionRegions": [
          "Jammu & Kashmir",
          "Ladakh",
          "Himachal Pradesh",
          "Uttarakhand",
          "Sikkim",
          "Arunachal Pradesh"
        ],
        "textureQuestion": {
          "question": "How can the texture of mountain soil be described?",
          "options": [
            {
              "id": "t1",
              "text": "Sticky and clayey",
              "image": "assets/textures/sticky_clayey.jpg",
              "correct": false
            },
            {
              "id": "t2",
              "text": "Loose and sandy",
              "image": "assets/textures/loose_sandy.jpg",
              "correct": false
            },
            {
              "id": "t3",
              "text": "Rocky and stony",
              "image": "assets/textures/rocky_stony.jpg",
              "correct": true
            },
            {
              "id": "t4",
              "text": "Porous and crumbly",
              "image": "assets/textures/porous_crumbly.jpg",
              "correct": false
            }
          ]
        },
        "cropQuestion": {
          "question": "Which four of these crops are best supported by mountain soil?",
          "selectCount": 4,
          "options": [
            {
              "id": "c1",
              "text": "Apples",
              "image": "assets/crops/apple.jpg",
              "correct": true
            },
            {
              "id": "c2",
              "text": "Barley",
              "image": "assets/crops/barley.jpg",
              "correct": true
            },
            {
              "id": "c3",
              "text": "Coffee",
              "image": "assets/crops/coffee.jpg",
              "correct": true
            },
            {
              "id": "c4",
              "text": "Tea",
              "image": "assets/crops/tea.jpg",
              "correct": true
            },
            {
              "id": "c5",
              "text": "Rubber",
              "image": "assets/crops/rubber.jpg",
              "correct": false
            },
            {
              "id": "c6",
              "text": "Cashew",
              "image": "assets/crops/cashew.jpg",
              "correct": false
            }
          ]
        },
        "summary": {
          "texture": "Rocky and stony",
          "importantCrops": ["Tea", "Coffee", "Barley", "Apples"],
          "distribution": "Himalayan region and north-eastern hills."
        }
      }
    ]
  }
}