
// Motorcycle brand data
export interface Brand {
  id: string;
  name: string;
  logo: string;
  country: string;
  founded: number;
  knownFor: string[];
  description: string; // For the detail page
}

export const brands: Brand[] = [
  {
    id: "honda",
    name: "Honda",
    logo: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Japan",
    founded: 1948,
    knownFor: ["Sport", "Cruiser", "Adventure", "Standard"],
    description: "Honda Motor Co., Ltd. is a Japanese public multinational conglomerate manufacturer of automobiles, motorcycles, and power equipment. Honda has been the world's largest motorcycle manufacturer since 1959, reaching a production of 400 million by the end of 2019. Honda became the second-largest Japanese automobile manufacturer in 2001."
  },
  {
    id: "yamaha",
    name: "Yamaha",
    logo: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Japan",
    founded: 1955,
    knownFor: ["Sport", "Adventure", "Naked", "Off-road"],
    description: "Yamaha Motor Company Limited is a Japanese manufacturer of motorcycles, marine products such as boats and outboard motors, and other motorized products. Yamaha motorcycles are known for their sporty performance and innovative technology."
  },
  {
    id: "ducati",
    name: "Ducati",
    logo: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Italy",
    founded: 1926,
    knownFor: ["Sport", "Naked", "Adventure"],
    description: "Ducati Motor Holding S.p.A. is an Italian motorcycle manufacturing company headquartered in Bologna, Italy. Ducati is known for high-performance motorcycles characterized by large-capacity four-stroke, 90° V-twin engines, with a desmodromic valve design."
  },
  {
    id: "harley-davidson",
    name: "Harley-Davidson",
    logo: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&q=80&w=200&h=200",
    country: "United States",
    founded: 1903,
    knownFor: ["Cruiser", "Touring", "Custom"],
    description: "Harley-Davidson, Inc., or Harley, is an American motorcycle manufacturer founded in 1903 in Milwaukee, Wisconsin. Harley-Davidson motorcycles are distinctive in design and known for the tradition of heavy customization that gave rise to the chopper motorcycle style."
  },
  {
    id: "bmw",
    name: "BMW Motorrad",
    logo: "https://images.unsplash.com/photo-1501286353178-1ec871214838?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Germany",
    founded: 1923,
    knownFor: ["Adventure", "Touring", "Sport", "Urban"],
    description: "BMW Motorrad is the motorcycle brand of BMW, part of its Corporate and Brand Development division. BMW Motorrad has produced motorcycles since 1923, and achieved record sales for the fifth year in succession in 2015. With its BMW GS series, BMW is often credited with inventing the adventure touring segment."
  },
  {
    id: "triumph",
    name: "Triumph",
    logo: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&q=80&w=200&h=200",
    country: "United Kingdom",
    founded: 1902,
    knownFor: ["Modern Classic", "Adventure", "Roadster", "Cruiser"],
    description: "Triumph Motorcycles Ltd is the largest British motorcycle manufacturer, established in 1983 by John Bloor after the original company Triumph Engineering went into receivership. The new company continues Triumph's distinctive line of motorcycles and still operates from its original Hinckley headquarters."
  },
  {
    id: "kawasaki",
    name: "Kawasaki",
    logo: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Japan",
    founded: 1963,
    knownFor: ["Sport", "Cruiser", "Off-road", "Adventure"],
    description: "Kawasaki Heavy Industries, Ltd. is a Japanese multinational corporation, with its motorcycle division being one of the major motorcycle manufacturers. Kawasaki motorcycles, particularly the Ninja series, are known for their high performance and sporty designs."
  },
  {
    id: "suzuki",
    name: "Suzuki",
    logo: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=200&h=200",
    country: "Japan",
    founded: 1909,
    knownFor: ["Sport", "Standard", "Adventure", "Cruiser"],
    description: "Suzuki Motor Corporation is a Japanese multinational corporation that manufactures automobiles, four-wheel drive vehicles, motorcycles, all-terrain vehicles, outboard marine engines, wheelchairs and a variety of other small internal combustion engines."
  }
];
