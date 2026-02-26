import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp-up to 20 users
        { duration: '1m', target: 20 },  // Maintain at 20 users
        { duration: '30s', target: 0 },  // Ramp-down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    },
}

export default function () {
    // Test the public landing page route
    const resHome = http.get('http://localhost:3000/')

    check(resHome, {
        'status is 200': (r) => r.status === 200,
        'transaction time < 500ms': (r) => r.timings.duration < 500,
    })

    sleep(1) // Wait 1 second before simulating the next user action

    // Simulate a user checking projects
    const resProjects = http.get('http://localhost:3000/projects')
    check(resProjects, {
        'status is 200': (r) => r.status === 200,
    })

    sleep(1)
}
