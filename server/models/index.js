const User = require('./User');
const Resume = require('./Resume');
const InterviewSession = require('./InterviewSession');

// In-memory data store for mock mode
const mockStorage = {
  users: [],
  resumes: [],
  interviews: []
};

// Simple Mock Query Builder class
class MockQuery {
  constructor(data, isSingle = false) {
    this.data = [...data];
    this.isSingle = isSingle;
  }
  
  sort(options) {
    if (this.data && this.data.length > 0) {
      this.data.sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
    }
    return this;
  }

  skip(num) {
    if (this.data) {
      this.data = this.data.slice(num);
    }
    return this;
  }

  limit(num) {
    if (this.data) {
      this.data = this.data.slice(0, num);
    }
    return this;
  }

  select(fields) {
    return this;
  }

  async then(resolve, reject) {
    if (this.isSingle) {
      resolve(this.data[0] || null);
    } else {
      resolve(this.data);
    }
  }
}

// Generate a Mock model class
const createMockModel = (collectionName, storageKey) => {
  const getCollection = () => mockStorage[storageKey];
  
  const modelClass = class {
    constructor(data) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = 'mock-' + Math.random().toString(36).substring(2, 9);
      }
      if (!this.createdAt) {
        this.createdAt = new Date();
      }
    }

    async save() {
      const collection = getCollection();
      const idx = collection.findIndex(item => String(item._id) === String(this._id));
      if (idx !== -1) {
        collection[idx] = this;
      } else {
        collection.push(this);
      }
      return this;
    }
  };

  modelClass.find = (filter) => {
    let result = [...getCollection()];
    if (filter && filter.userId) {
      result = result.filter(item => String(item.userId) === String(filter.userId));
    }
    return new MockQuery(result);
  };

  modelClass.findOne = (filter) => {
    let result = [...getCollection()];
    if (filter) {
      if (filter.userId) {
        result = result.filter(item => String(item.userId) === String(filter.userId));
      }
      if (filter.email) {
        result = result.filter(item => item.email && item.email.toLowerCase() === filter.email.toLowerCase());
      }
      if (filter._id) {
        result = result.filter(item => String(item._id) === String(filter._id));
      }
    }
    return new MockQuery(result, true);
  };

  modelClass.findById = (id) => {
    let result = [...getCollection()];
    result = result.filter(item => String(item._id) === String(id));
    return new MockQuery(result, true);
  };

  modelClass.create = async (data) => {
    if (data && typeof data.email === 'string') {
      data.email = data.email.toLowerCase();
    }
    const instance = new modelClass(data);
    await instance.save();
    return instance;
  };

  modelClass.countDocuments = async (filter) => {
    let result = getCollection();
    if (filter && filter.userId) {
      result = result.filter(item => String(item.userId) === String(filter.userId));
    }
    return result.length;
  };

  modelClass.deleteMany = async (filter) => {
    if (filter && filter.userId) {
      mockStorage[storageKey] = getCollection().filter(item => String(item.userId) !== String(filter.userId));
    } else {
      mockStorage[storageKey] = [];
    }
    return { deletedCount: 1 };
  };

  return modelClass;
};

// Export dynamic selector
const MockUser = createMockModel('User', 'users');
const MockResume = createMockModel('Resume', 'resumes');
const MockInterviewSession = createMockModel('InterviewSession', 'interviews');

module.exports = {
  get User() {
    return global.useMockDb ? MockUser : User;
  },
  get Resume() {
    return global.useMockDb ? MockResume : Resume;
  },
  get InterviewSession() {
    return global.useMockDb ? MockInterviewSession : InterviewSession;
  },
  get isMockActive() {
    return !!global.useMockDb;
  }
};
