// The types used in the project

// Type for a bike
export type Bike = {
    _id: string;
    // Bike (uniqeness)
    bikeModel: string;

    // Rental details
    pricePerHour: number;
    isAvailable: boolean;

    // Bike details
    brand: string;
    cc: number;
    horsePower: number;
    type: string;

    imageURL: string;
}

// Type for a User
export type User = {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
}

// Type for a Booking
export type Booking = {
    _id: string;
    userId: string;
    bikeId: string;
    bike: Bike;
    startTime: Date | string;
    endTime: Date | string;
    status: string;
}

export type BookingData = Bike & {
    startTime: Date;
    endTime: Date;
}

// Type for Filter
export type FilterData = {
    brand: string[];
    cc: number[];
    type: string[];
    horsePower: number[];
}