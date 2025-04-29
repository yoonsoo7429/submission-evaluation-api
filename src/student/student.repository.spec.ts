import { StudentRepository } from './student.repository';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

describe('StudentRepository', () => {
  let repository: StudentRepository;
  let mockStudentRepository: jest.Mocked<Repository<Student>>;

  beforeEach(() => {
    mockStudentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as any;

    repository = new StudentRepository(mockStudentRepository);
  });

  it('should create a student', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const studentName = 'Test Student';

    const mockStudent = { email, password, studentName } as Student;
    mockStudentRepository.create.mockReturnValue(mockStudent);
    mockStudentRepository.save.mockResolvedValue(mockStudent);

    const result = await repository.createStudent(email, password, studentName);

    expect(mockStudentRepository.create).toHaveBeenCalledWith({
      email,
      password,
      studentName,
    });
    expect(mockStudentRepository.save).toHaveBeenCalledWith(mockStudent);
    expect(result).toEqual(mockStudent);
  });

  it('should find a student by email', async () => {
    const email = 'test@example.com';
    const mockStudent = { email } as Student;
    mockStudentRepository.findOne.mockResolvedValue(mockStudent);

    const result = await repository.findStudentByEmail(email);

    expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
      where: { email },
    });
    expect(result).toEqual(mockStudent);
  });

  it('should find a student by id', async () => {
    const studentId = 1;
    const mockStudent = { studentId } as Student;
    mockStudentRepository.findOne.mockResolvedValue(mockStudent);

    const result = await repository.findStudentByPk(studentId);

    expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
      where: { studentId },
    });
    expect(result).toEqual(mockStudent);
  });
});
