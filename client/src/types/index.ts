interface User {
  _id: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  zipCode: string;
  region: string;
  country: string;
  email: string;
  emailConf: boolean;
}

interface Service {
  _id: string;
  serviceName: string;
  category: ServiceCategory;
  availability: string[];
  duration: Number;
  price: Number;
  earlyBird: Date;
}

enum ServiceCategory {
  FaceCare = "Face care",
  BodyCare = "Body care",
  EyebrowTattooing = "Eyebrow tattooing",
  Hairstyling = "Hairstyling",
}

interface Reservation {
  userEmail: string;
  service: Service;
  date: Date;
  price: number;
  token: string;
  promoCode: string;
}

interface PromoCode {
  code: string;
  userEmail: string;
}
