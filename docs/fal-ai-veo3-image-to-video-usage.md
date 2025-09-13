# Veo3 Image-to-Video Usage Guide

## Overview

The **Veo3 Image-to-Video** model (al-ai/veo3/image-to-video) is an advanced AI-powered tool that generates high-quality videos from static images using Google's Veo3 architecture. This model creates smooth, realistic motion with precise control over animation parameters and motion complexity, making it ideal for creating dynamic content from still images.


## Key Features

- **High-Quality Output**: Generates smooth, realistic motion with excellent visual quality
- **Motion Control**: Precise control over motion complexity using motion bucket IDs
- **Resolution Flexibility**: Support for various resolutions from 256x256 to 1024x1024
- **Frame Control**: Generate videos with 1-32 frames at customizable frame rates
- **Advanced Parameters**: Fine-tune generation with conditional augmentation and decoding temperature
- **Queue Processing**: Handle long-running requests asynchronously
- **Webhook Integration**: Receive notifications when processing completes
- **Cost Optimization**: Pay-per-compute-second pricing model


## Pricing Structure

### Cost Calculation
- **Base Rate**: .0013 per compute second
- **Billing**: Based on actual compute time used
- **No Hidden Fees**: Only pay for what you use

### Cost Examples

| Scenario | Frames | Resolution | Steps | Estimated Cost | Description |
|----------|--------|------------|-------|----------------|-------------|
| Basic Clip | 16 | 512x512 | 14 | .104 | Quick social media clip |
| Enhanced Video | 24 | 512x512 | 20 | .234 | Standard promotional video |
| HD Quality | 16 | 768x768 | 20 | .351 | Professional content |
| HD Extended | 24 | 768x768 | 25 | .585 | High-quality extended video |
| Ultra HD | 24 | 1024x1024 | 30 | .17 | High-end production |
| Ultra HD Extended | 32 | 1024x1024 | 35 | .95 | Maximum quality extended video |
