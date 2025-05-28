import * as math from 'mathjs';

class BalloonEKF {
    private x: math.Matrix;          // State: [altitude, velocity, acceleration, burner_gain]
    private P: math.Matrix;          // State covariance
    private Q: math.Matrix;          // Process noise covariance
    private R: math.Matrix;          // Measurement noise covariance
    private F: math.Matrix;          // Linearized state transition matrix
    // private B: math.Matrix;          // Control input effect vector
    private H: math.Matrix;          // Measurement matrix
    // private lastLoudnessDuration: number;
    private initialized: boolean;

    constructor() {
        this.x = math.matrix([0.0, 0.0, 0.0, 0.1]); // k = 0.1 m/s^3 per loudness-duration unit
        
        this.P = math.multiply(math.identity(4), 10.0) as math.Matrix;
        this.P.subset(math.index(3, 3), 1.0);

        this.Q = math.zeros(4, 4) as math.Matrix;
        this.Q.subset(math.index(0, 0), 0.01);
        this.Q.subset(math.index(1, 1), 0.01);
        this.Q.subset(math.index(2, 2), 0.001);
        this.Q.subset(math.index(3, 3), 0.001);

        this.R = math.matrix([[0.1]]) as math.Matrix;

        this.H = math.matrix([[1.0, 0.0, 0.0, 0.0]]) as math.Matrix;
        // this.B = math.matrix([0.0, 0.0, 1.0, 0.0]) as math.Matrix;

        this.F = math.zeros(2, 2) as math.Matrix;

        // this.lastLoudnessDuration = 0.0;
        this.initialized = false;
    }

    public processMeasurement(dt: number, altitude: number, loudness: number, duration: number): void {
        if (!this.initialized) {
            this.x.subset(math.index(0), altitude);
            this.initialized = true;
            return;
        }
        const loudnessDuration = loudness * duration;
        this.predict(dt, loudnessDuration);
        this.update(altitude);
        // this.lastLoudnessDuration = loudnessDuration;
    }

    public setVariance(variance: number): void {
        this.R.subset(math.index(0, 0), variance);
    }

    private predict(dt: number, loudnessDuration: number): void {
        const x_pred = math.matrix([
            this.x.get([0]) + this.x.get([1]) * dt + 0.5 * this.x.get([2]) * dt * dt,
            this.x.get([1]) + this.x.get([2]) * dt,
            this.x.get([2]) + this.x.get([3]) * loudnessDuration,
            this.x.get([3])
        ]);

        this.F = math.identity(4) as math.Matrix;
        this.F.subset(math.index(0, 1), dt);
        this.F.subset(math.index(0, 2), 0.5 * dt * dt);
        this.F.subset(math.index(1, 2), dt);
        this.F.subset(math.index(2, 3), loudnessDuration);

        this.x = x_pred;
        this.P = math.add(
            math.multiply(math.multiply(this.F, this.P), math.transpose(this.F)),
            this.Q
        ) as math.Matrix;
    }

    private update(altitude: number): void {
        const z = math.matrix([altitude]);
        const y = math.subtract(z, math.multiply(this.H, this.x)) as math.Matrix;
        
        const S = math.add(
            math.multiply(math.multiply(this.H, this.P), math.transpose(this.H)),
            this.R
        ) as math.Matrix;
        
        const K = math.multiply(
            math.multiply(this.P, math.transpose(this.H)),
            math.inv(S)
        ) as math.Matrix;
        
        this.x = math.add(this.x, math.multiply(K, y)) as math.Matrix;
        
        const I = math.identity(4) as math.Matrix;
        this.P = math.multiply(
            math.subtract(I, math.multiply(K, this.H)),
            this.P
        ) as math.Matrix;
    }

    public isDecelerating(): { isDecelerating: boolean; timeToZeroSpeed: number } {
        if (!this.initialized) {
            return { isDecelerating: false, timeToZeroSpeed: 0 };
        }

        const v = this.x.get([1]);
        const a = this.x.get([2]);

        if (v * a < 0) {
            const timeToZeroSpeed = -v / a;
            return { isDecelerating: true, timeToZeroSpeed };
        }
        return { isDecelerating: false, timeToZeroSpeed: 0 };
    }

    public getZeroSpeedAltitude(): { valid: boolean; altitude: number } {
        if (!this.initialized) {
            return { valid: false, altitude: 0 };
        }

        const h = this.x.get([0]);
        const v = this.x.get([1]);
        const a = this.x.get([2]);

        if (v * a < 0) {
            const t = -v / a;
            const altitude = h + v * t + 0.5 * a * t * t;
            return { valid: true, altitude };
        }
        return { valid: false, altitude: 0 };
    }

    public getAltitude(): number {
        return this.x.get([0]);
    }

    public getVelocity(): number {
        return this.x.get([1]);
    }

    public getAcceleration(): number {
        return this.x.get([2]);
    }

    public getBurnerGain(): number {
        return this.x.get([3]);
    }
}

export default BalloonEKF;