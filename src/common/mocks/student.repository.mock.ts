import { Student } from 'src/student/entities/student.entity';

export const mockStudent: Student = {
  studentId: 1,
  studentName: '홍길동',
  email: 'test1@test.com',
  password: '$2b$10$7XEv4.RWaKmM0L5oFJ/Yd.6n2/j0nZBuPQZ2jeyTUpKPZL8s/yN8O',
  createdAt: new Date(),
  submissions: [],
};

export const MockStudentRepository = {
  createStudent: jest.fn().mockResolvedValue(mockStudent),
  findStudentByEmail: jest.fn().mockResolvedValue(mockStudent),
  findStudentByPk: jest.fn().mockResolvedValue(mockStudent),
};
