const UserRoleEnum = {
  user:"user",
  admin:"admin"
} as const

type User = {
  id: string
  name: string
  email: string
  role: typeof UserRoleEnum[keyof typeof UserRoleEnum]
}

const DummyUser: User[] = [
  {
    id:"df197351-2183-4822-aa68-6e401828d8df",
    name:"Budi yahahah",
    email:"dummy1@gmail.com",
    role: "user"
  },
  {
    id:"18670701-cb07-4c52-95b8-dc16c8eb1c70",
    name:"Budi yahahaha1",
    email:"dummy2@gmail.com",
    role:"admin"
  },
  {
    id:"04daa33e-8f6a-4dce-a37a-8d188bb9eb1c",
    name:"Budi yahahaha2",
    email:"dummy3@gmail.com",
    role:"user"
  },
  {
    id: "a8c3e5f1-4b2d-4e9a-b7c3-1f8d6e4a2b5c",
    name: "Siti Nurhaliza",
    email: "dummy4@gmail.com",
    role: "user"
  },
  {
    id: "b9d4f6a2-5c3e-4f1b-c8d4-2a9e7f5b3c6d",
    name: "Ahmad Wijaya",
    email: "dummy5@gmail.com",
    role: "admin"
  },
  {
    id: "c1e5a7b3-6d4f-4a2c-d9e5-3b1f8a6c4d7e",
    name: "Dewi Lestari",
    email: "dummy6@gmail.com",
    role: "user"
  },
  {
    id: "d2f6b8c4-7e5a-4b3d-e1f6-4c2a9b7d5e8f",
    name: "Rudi Hartono",
    email: "dummy7@gmail.com",
    role: "user"
  },
  {
    id: "e3a7c9d5-8f6b-4c4e-f2a7-5d3b1c8e6f9a",
    name: "Maya Sari",
    email: "dummy8@gmail.com",
    role: "admin"
  },
  {
    id: "f4b8d1e6-9a7c-4d5f-a3b8-6e4c2d9f7a1b",
    name: "Eko Prasetyo",
    email: "dummy9@gmail.com",
    role: "user"
  },
  {
    id: "a5c9e2f7-1b8d-4e6a-b4c9-7f5d3e1a8b2c",
    name: "Rina Kusuma",
    email: "dummy10@gmail.com",
    role: "user"
  },
  {
    id: "b6d1f3a8-2c9e-4f7b-c5d1-8a6e4f2b9c3d",
    name: "Agus Setiawan",
    email: "dummy11@gmail.com",
    role: "admin"
  },
  {
    id: "c7e2a4b9-3d1f-4a8c-d6e2-9b7f5a3c1d4e",
    name: "Fitri Handayani",
    email: "dummy12@gmail.com",
    role: "user"
  },
  {
    id: "d8f3b5c1-4e2a-4b9d-e7f3-1c8a6b4d2e5f",
    name: "Bambang Sudarmanto",
    email: "dummy13@gmail.com",
    role: "user"
  },
  {
    id: "e9a4c6d2-5f3b-4c1e-f8a4-2d9b7c5e3f6a",
    name: "Indah Permata",
    email: "dummy14@gmail.com",
    role: "admin"
  },
  {
    id: "f1b5d7e3-6a4c-4d2f-a9b5-3e1c8d6f4a7b",
    name: "Hendra Gunawan",
    email: "dummy15@gmail.com",
    role: "user"
  },
  {
    id: "a2c6e8f4-7b5d-4e3a-b1c6-4f2d9e7a5b8c",
    name: "Lina Marlina",
    email: "dummy16@gmail.com",
    role: "user"
  },
  {
    id: "b3d7f9a5-8c6e-4f4b-c2d7-5a3e1f8b6c9d",
    name: "Yanto Suryanto",
    email: "dummy17@gmail.com",
    role: "admin"
  },
  {
    id: "c4e8a1b6-9d7f-4a5c-d3e8-6b4f2a9c7d1e",
    name: "Kartika Sari",
    email: "dummy18@gmail.com",
    role: "user"
  },
  {
    id: "d5f9b2c7-1e8a-4b6d-e4f9-7c5a3b1d8e2f",
    name: "Dimas Anggara",
    email: "dummy19@gmail.com",
    role: "user"
  },
  {
    id: "e6a1c3d8-2f9b-4c7e-f5a1-8d6b4c2e9f3a",
    name: "Sri Wahyuni",
    email: "dummy20@gmail.com",
    role: "admin"
  },
  {
    id: "f7b2d4e9-3a1c-4d8f-a6b2-9e7c5d3f1a4b",
    name: "Joko Widodo",
    email: "dummy21@gmail.com",
    role: "user"
  },
  {
    id: "a8c3e5f1-4b2d-4e9a-b7c3-1f8d6e4a2b5d",
    name: "Nurul Hidayah",
    email: "dummy22@gmail.com",
    role: "user"
  },
  {
    id: "b9d4f6a2-5c3e-4f1b-c8d4-2a9e7f5b3c6e",
    name: "Tommy Soeharto",
    email: "dummy23@gmail.com",
    role: "admin"
  }
]

export {type User, DummyUser}