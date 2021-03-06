import React from 'react';

class MathBombsClient {
  constructor({ debug, authToken } = {}) {
    this.debug = debug;
    this.authToken = authToken;
    this.debug = true;
  }

  uriMap = {
    auth_tokens: '/api/v1/auth-tokens',
    powerups: '/api/v1/powerups',
    rewards: '/api/v1/rewards',
    skills: '/api/v1/skills',
    teachers: '/api/v1/teachers',
  };

  baseHeaders() {
    return this.authToken ? { 'x-auth-token': this.authToken } : {};
  }

  get(uri) {
    const headers = this.baseHeaders();
    return fetch(uri, { method: 'GET', headers })
    .then(res => res.json())
    .then(data => {
      if (this.debug) console.log(`MathBombsClient GET => ${uri}`, data);
      return data;
    });
  }

  post(uri, data) {
    const headers = this.baseHeaders();
    headers['content-type'] = 'application/json';
    if (this.authToken) headers['x-auth-token'] = this.authToken;
    return fetch(uri, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    })
    .then(res => res.json())
    .then(data => {
      if (this.debug) console.log(`MathBombsClient POST => ${uri}`, data);
      return data;
    });
  }

  patch(uri, data) {
    const headers = this.baseHeaders();
    headers['content-type'] = 'application/json';
    if (this.authToken) headers['x-auth-token'] = this.authToken;
    return fetch(uri, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers,
    })
    .then(res => res.json())
    .then(data => {
      if (this.debug) console.log(`MathBombsClient PATCH => ${uri}`, data);
      return data;
    });
  }

  del(uri) {
    const headers = this.baseHeaders();
    return fetch(uri, {
      method: 'DELETE',
      headers,
    })
    .then(res => res.json())
    .then(data => {
      if (this.debug) console.log(`MathBombsClient DELETE => ${uri}`, data);
      return data;
    });
  }

  createAuthToken({ email, password }) {
    if (!email) return this.err('The email is required.');
    if (!password) return this.err('The password is required');
    return this.post('/api/v1/auth-tokens', { email, password });
  }

  createPasswordResetToken({ email }) {
    if (!email) return this.err('The email is required.');
    return this.post('/api/v1/password-reset-tokens', { email });
  }

  resetPassword({ token, password }) {
    if (!token) return this.err('The token is required.');
    if (!password) return this.err('The password is required');
    return this.post('/api/v1/password-reset-tokens/' + token, { password });
  }

  createTeacher({ name, email, password }) {
    if (!name) return this.err('The name is required.');
    if (!email) return this.err('The email is required.');
    if (!password) return this.err('The password is required.');
    return this.post('/api/v1/teachers', { name, email, password });
  }

  getStudent(student) {
    const id = typeof student === 'object' ? student.id : student;
    return this.get('/api/v1/students/' + id).then(data => {
      data.student = data.data;
      return data;
    });
  }

  getReport(student) {
    const id = typeof student === 'object' ? student.id : student;
    return this.get('/api/v1/reports/' + id);
  }

  getStudents({ teacher, teacher_id }) {
    if (teacher) teacher_id = teacher.id;
    return this.get('/api/v1/students?teacher_id=' + teacher_id).then(data => {
      data.students = data.data;
      return data;
    });
  }

  err(msg) {
    return new Promise((resolve) => resolve({ error: msg, errors: [msg] }));
  }

  createStudent({ name }) {
    if (!name) return this.err('The student name is required');
    return this.post('/api/v1/students', { name }).then(data => {
      data.student = data.data;
      return data;
    });
  }

  deleteStudent({ id }) {
    const headers = this.authToken ? { 'x-auth-token': this.authToken } : {};
    return this.del('/api/v1/students/' + id);
  }

  updateStudent({ id }, update) {
    return this.patch('/api/v1/students/' + id, update);
  }

  createProblems({ student_id, sheet_id }) {
    return this.post('/api/v1/problems', { student_id, sheet_id }).then(data => {
      data.problems = data.data;
      return data;
    });
  }

  updateProblem(problem) {
    return this.patch('/api/v1/problems/' + problem.id, problem);
  }

  usePowerup({ powerup_id, student_id }) {
    const payload = { action: 'use-powerup', student_id, powerup_id };
    return this.post(`/api/v1/students/${student_id}/actions`, payload).then(data => {
      data.student = data.data;
      return data;
    });
  };

  createSampleProblem({ student_id }) {
    return this.post('/api/v1/sample-problems', { student_id }).then(res => {
      res[res.data.type] = res.data.attributes;
      return res;
    });
  }

  getSkills() {
    const uri = this.uriFor('skills');
    return this.get(uri);
  }

  updateTeacher(teacher, update) {
    const uri = this.uriFor('teachers', teacher.id);
    return this.patch(uri, update);
  }

  deleteAuthTokens() {
    return this.del(this.uriFor('auth_tokens'));
  }

  getRewards({ student_id }) {
    const uri = this.uriFor('rewards');
    return this.get(uri + '?student_id=' + student_id);
  }

  createReward(payload) {
    const uri = this.uriFor('rewards');
    return this.post(uri, payload);
  }

  deleteReward({ reward_id }) {
    const uri = this.uriFor('rewards', reward_id);
    return this.del(uri);
  }

  updatePowerup({ powerup_id, student_id }, { cnt }) {
    const uri = this.uriFor('powerups', powerup_id, { student_id });
    return this.patch(uri, { cnt });
  }

  uriFor(type, id, query) {
    let uri = this.uriMap[type];
    if (!uri) throw 'No URI mapping exists for ' + type;
    if (id) uri += ('/' + id);
    if (query) uri += ('?' + new URLSearchParams(query));
    return uri;
  }

}

const ClientContext = React.createContext();

export { ClientContext, MathBombsClient };
