pragma circom 2.0.0;

include "gates.circom";
include "comparators.circom";
include "bitify.circom";

template ETAVerifier() {
    // Public inputs
    signal input sourceLatitude;
    signal input sourceLongitude;
    signal input claimedETA;
    signal input actualETA;
    signal input tolerance;

    // Calculate absolute difference
    signal difference;
    signal subtraction <== claimedETA - actualETA;
    
    // Convert to bits to check sign
    component num2Bits = Num2Bits(32);
    num2Bits.in <== subtraction;
    
    // If the most significant bit is 1, number is negative
    signal isNegative <== num2Bits.out[31];
    
    // Calculate absolute value: if negative, multiply by -1
    difference <== subtraction * (1 - 2 * isNegative);
    
    // Check if within tolerance
    component lessThan = LessThan(32);
    lessThan.in[0] <== difference;
    lessThan.in[1] <== tolerance;
    
    signal output isValid <== lessThan.out;
}

component main {public [sourceLatitude, sourceLongitude, claimedETA, actualETA, tolerance]} = ETAVerifier();