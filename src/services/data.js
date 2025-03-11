// data.js (merged all categories into one export)
import fridge1 from "../img/frige-1.jpg";
import fridge2 from "../img/frige-2.jpg";
import frige1 from "../img/frige-1.jpg";
import frige2 from "../img/frige-2.jpg";
import ac1 from "../img/SAC-2.jpg";
import ac2 from "../img/WAC.jpg";
import mw from "../img/MW.jpg";
import FL_WM from "../img/FL_WM.jpg";
import TL_WM from "../img/TL_WM.jpg";

export const categories ={
    "categories": [
      {
        "id": 1,
        "name": "Appliance",
        "homePageEnabled": true,
        "items": [
          {
            "id": 1,
            "name": "AC Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Split AC",
                "image": ac1,
                "serviceTypes": ["Repair", "Service", "Gas Change"],
                "brands": ["Samsung", "LG", "Daikin"]
              },
              {
                "id": 2,
                "name": "Window AC",
                "image": ac2,
                "serviceTypes": ["Repair", "Service", "Gas Change"],
                "brands": ["Whirlpool", "Carrier", "Hitachi"]
              }
            ]
          },
          {
            "id": 2,
            "name": "Microwave Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Microwave Repair",
                "image": mw,
                "serviceTypes": ["Repair", "Service"],
                "brands": ["Panasonic", "Samsung", "LG"]
              }
            ]
          },
          {
            "id": 3,
            "name": "Refrigerator Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Double Door Refrigerator",
                "image": frige1,
                "serviceTypes": ["Repair", "Service", "Gas Change"],
                "brands": ["Samsung", "LG", "Whirlpool"]
              },
              {
                "id": 2,
                "name": "Single Door Refrigerator",
                "image": frige2,
                "serviceTypes": ["Repair", "Service", "Gas Change"],
                "brands": ["Godrej", "Haier", "Videocon"]
              }
            ]
          },
          {
            "id": 4,
            "name": "Washing Machine Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Top Load Washing Machine",
                "image": FL_WM,
                "serviceTypes": ["Repair", "Service", "Filter Change"],
                "brands": ["Samsung", "LG", "Whirlpool"]
              },
              {
                "id": 2,
                "name": "Front Load Washing Machine",
                "image": TL_WM,
                "serviceTypes": ["Repair", "Service", "Filter Change"],
                "brands": []
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Automobile",
        "homePageEnabled": false,
        "items": [
          {
            "id": 1,
            "name": "Two wheeler Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Bike",
                "image": ac1,
                "serviceTypes": ["Repair", "Service", "Sell"],
                "brands": ["Hero", "TVS", "Honda"]
              },
              {
                "id": 2,
                "name": "Scotty",
                "image": ac2,
                "serviceTypes": ["Repair", "Service", "Sell"],
                "brands": ["Hero", "Ola", "Ather"]
              }
            ]
          },
          {
            "id": 2,
            "name": "4 Wheler Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Car Repair",
                "image": mw,
                "serviceTypes": ["Repair", "Service"],
                "brands": []
              }
            ]
          },
          {
            "id": 3,
            "name": "Heavy Vehicle Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Truck",
                "image": fridge1,
                "serviceTypes": ["Repair", "Service", "Towing"],
                "brands": ["Ashok Leyland", "TATA"]
              },
              {
                "id": 2,
                "name": "Bus",
                "image": fridge2,
                "serviceTypes": ["Repair", "Service", "Towing"],
                "brands": ["Godrej", "Haier"]
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "Kitchen",
        "homePageEnabled": true,
        "items": [
          {
            "id": 1,
            "name": "Oven Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Microwave Oven",
                "image": mw,
                "serviceTypes": ["Repair", "Service"],
                "brands": ["Panasonic", "Samsung", "LG"]
              }
            ]
          },
          {
            "id": 2,
            "name": "Dishwasher Repair & Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Dishwasher",
                "image": ac1,
                "serviceTypes": ["Repair", "Service"],
                "brands": ["Bosch", "Whirlpool", "LG"]
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "name": "Household",
        "homePageEnabled": false,
        "items": [
          {
            "id": 1,
            "name": "Cleaning Appliance Repair",
            "subcategories": [
              {
                "id": 1,
                "name": "Vacuum Cleaner",
                "image": ac2,
                "serviceTypes": ["Repair", "Service"],
                "brands": ["Dyson", "Hoover", "Eureka"]
              }
            ]
          },
          {
            "id": 2,
            "name": "Laundry Service",
            "subcategories": [
              {
                "id": 1,
                "name": "Iron",
                "image": FL_WM,
                "serviceTypes": ["Repair", "Service"],
                "brands": ["Philips", "Black+Decker", "Rowenta"]
              }
            ]
          }
        ]
      }
    ]
  }
  