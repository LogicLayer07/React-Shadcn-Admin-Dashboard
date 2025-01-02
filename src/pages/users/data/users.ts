type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: 'active' | 'inactive' | 'invited' | 'suspended';
  role: 'superadmin' | 'admin' | 'cashier' | 'manager';
  createdAt: string;
  updatedAt: string;
};

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Chris', 'Diana', 'Emma', 'Frank', 'Grace', 'Henry'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lee'];
const statuses: User['status'][] = ['active', 'inactive', 'invited', 'suspended'];
const roles: User['role'][] = ['superadmin', 'admin', 'cashier', 'manager'];

export const users: User[] = Array.from({ length: 20 }, (): User => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  return {
    id: generateUUID(),
    firstName,
    lastName,
    username,
    email,
    phoneNumber: `+1-${Math.floor(1000000000 + Math.random() * 9000000000)}`, // US-style phone number
    status: getRandomElement(statuses),
    role: getRandomElement(roles),
    createdAt: generateRandomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: generateRandomDate(new Date(2023, 0, 1), new Date()),
  };
});

