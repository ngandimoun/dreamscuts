'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, Download, Eye, Settings, FileText, Image, Video, Music } from 'lucide-react';

interface ShotstackResult {
  success: boolean;
  data?: {
    response: {
      id: string;
      status: string;
      url?: string;
      error?: string;
    };
  };
  error?: string;
  details?: string;
}

export default function TestShotstackPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ShotstackResult | null>(null);
  const [videoType, setVideoType] = useState<'text' | 'image-text' | 'slideshow' | 'custom'>('text');
  const [environment, setEnvironment] = useState<'stage' | 'v1'>('stage');

  // Text video settings
  const [textSettings, setTextSettings] = useState({
    text: 'Hello World!',
    duration: 5,
    background: '#000000',
    fontColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Montserrat ExtraBold',
    width: 1280,
    height: 720,
    format: 'mp4' as 'mp4' | 'gif',
  });

  // Image + Text video settings
  const [imageTextSettings, setImageTextSettings] = useState({
    imageUrl: 'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
    text: 'Beautiful Waterfall',
    duration: 5,
    textPosition: 'center' as 'top' | 'center' | 'bottom',
    textColor: '#ffffff',
    fontSize: 32,
    fontFamily: 'Montserrat ExtraBold',
    width: 1280,
    height: 720,
    format: 'mp4' as 'mp4' | 'gif',
  });

  // Slideshow settings
  const [slideshowSettings, setSlideshowSettings] = useState({
    images: [
      'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg',
      'https://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg',
      'https://shotstack-assets.s3.amazonaws.com/images/beach-square.jpg',
    ].join('\n'),
    durationPerImage: 3,
    transition: 'fade' as 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown',
    background: '#000000',
    width: 1280,
    height: 720,
    format: 'mp4' as 'mp4' | 'gif',
  });

  // Custom JSON settings
  const [customJson, setCustomJson] = useState(`{
  "timeline": {
    "background": "#000000",
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Custom Video",
              "font": {
                "family": "Montserrat ExtraBold",
                "size": 32,
                "color": "#ffffff"
              },
              "alignment": {
                "horizontal": "center"
              }
            },
            "start": 0,
            "length": 5,
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1280,
      "height": 720
    }
  }
}`);

  const handleRender = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      let input;

      switch (videoType) {
        case 'text':
          input = {
            timeline: {
              background: textSettings.background,
              tracks: [
                {
                  clips: [
                    {
                      asset: {
                        type: 'text',
                        text: textSettings.text,
                        font: {
                          family: textSettings.fontFamily,
                          size: textSettings.fontSize,
                          color: textSettings.fontColor,
                        },
                        alignment: {
                          horizontal: 'center',
                          vertical: 'middle',
                        },
                      },
                      start: 0,
                      length: textSettings.duration,
                      transition: {
                        in: 'fade',
                        out: 'fade',
                      },
                    },
                  ],
                },
              ],
            },
            output: {
              format: textSettings.format,
              size: {
                width: textSettings.width,
                height: textSettings.height,
              },
            },
          };
          break;

        case 'image-text':
          input = {
            timeline: {
              tracks: [
                {
                  clips: [
                    {
                      asset: {
                        type: 'image',
                        src: imageTextSettings.imageUrl,
                        fit: 'cover',
                      },
                      start: 0,
                      length: imageTextSettings.duration,
                    },
                  ],
                },
                {
                  clips: [
                    {
                      asset: {
                        type: 'text',
                        text: imageTextSettings.text,
                        font: {
                          family: imageTextSettings.fontFamily,
                          size: imageTextSettings.fontSize,
                          color: imageTextSettings.textColor,
                        },
                        alignment: {
                          horizontal: 'center',
                          vertical: imageTextSettings.textPosition,
                        },
                        background: {
                          color: '#000000',
                          opacity: 0.5,
                          padding: 20,
                          borderRadius: 10,
                        },
                      },
                      start: 0,
                      length: imageTextSettings.duration,
                      transition: {
                        in: 'fade',
                        out: 'fade',
                      },
                    },
                  ],
                },
              ],
            },
            output: {
              format: imageTextSettings.format,
              size: {
                width: imageTextSettings.width,
                height: imageTextSettings.height,
              },
            },
          };
          break;

        case 'slideshow':
          const images = slideshowSettings.images.split('\n').filter(url => url.trim());
          const clips = images.map((imageUrl, index) => ({
            asset: {
              type: 'image',
              src: imageUrl.trim(),
              fit: 'cover',
            },
            start: index * slideshowSettings.durationPerImage,
            length: slideshowSettings.durationPerImage,
            transition: {
              in: index === 0 ? 'fade' : slideshowSettings.transition,
              out: index === images.length - 1 ? 'fade' : slideshowSettings.transition,
            },
          }));

          input = {
            timeline: {
              background: slideshowSettings.background,
              tracks: [
                {
                  clips,
                },
              ],
            },
            output: {
              format: slideshowSettings.format,
              size: {
                width: slideshowSettings.width,
                height: slideshowSettings.height,
              },
            },
          };
          break;

        case 'custom':
          input = JSON.parse(customJson);
          break;

        default:
          throw new Error('Invalid video type');
      }

      const response = await fetch('/api/dreamcut/shotstack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          options: {
            environment,
          },
        }),
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Error rendering video:', error);
      setResult({
        success: false,
        error: 'Failed to render video',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async (renderId: string) => {
    try {
      const response = await fetch(`/api/dreamcut/shotstack?renderId=${renderId}&environment=${environment}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shotstack Video Editor Test</h1>
        <p className="text-muted-foreground">
          Test the Shotstack video editing API with various video types and configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Configure your video settings and render options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Selection */}
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select value={environment} onValueChange={(value: 'stage' | 'v1') => setEnvironment(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stage">Stage (Sandbox)</SelectItem>
                  <SelectItem value="v1">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="videoType">Video Type</Label>
              <Select value={videoType} onValueChange={(value: 'text' | 'image-text' | 'slideshow' | 'custom') => setVideoType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Video</SelectItem>
                  <SelectItem value="image-text">Image + Text</SelectItem>
                  <SelectItem value="slideshow">Slideshow</SelectItem>
                  <SelectItem value="custom">Custom JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Video Type Specific Settings */}
            <Tabs value={videoType} className="w-full">
              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Text</Label>
                  <Textarea
                    id="text"
                    value={textSettings.text}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter text to display"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={textSettings.duration}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      value={textSettings.fontSize}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="background">Background Color</Label>
                    <Input
                      id="background"
                      type="color"
                      value={textSettings.background}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, background: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fontColor">Font Color</Label>
                    <Input
                      id="fontColor"
                      type="color"
                      value={textSettings.fontColor}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, fontColor: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="image-text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={imageTextSettings.imageUrl}
                    onChange={(e) => setImageTextSettings(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overlayText">Overlay Text</Label>
                  <Input
                    id="overlayText"
                    value={imageTextSettings.text}
                    onChange={(e) => setImageTextSettings(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Text to overlay on image"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="textPosition">Text Position</Label>
                    <Select value={imageTextSettings.textPosition} onValueChange={(value: 'top' | 'center' | 'bottom') => setImageTextSettings(prev => ({ ...prev, textPosition: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageDuration">Duration (seconds)</Label>
                    <Input
                      id="imageDuration"
                      type="number"
                      value={imageTextSettings.duration}
                      onChange={(e) => setImageTextSettings(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="slideshow" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Image URLs (one per line)</Label>
                  <Textarea
                    id="images"
                    value={slideshowSettings.images}
                    onChange={(e) => setSlideshowSettings(prev => ({ ...prev, images: e.target.value }))}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="durationPerImage">Duration per Image (seconds)</Label>
                    <Input
                      id="durationPerImage"
                      type="number"
                      value={slideshowSettings.durationPerImage}
                      onChange={(e) => setSlideshowSettings(prev => ({ ...prev, durationPerImage: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transition">Transition</Label>
                    <Select value={slideshowSettings.transition} onValueChange={(value: 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown') => setSlideshowSettings(prev => ({ ...prev, transition: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slideLeft">Slide Left</SelectItem>
                        <SelectItem value="slideRight">Slide Right</SelectItem>
                        <SelectItem value="slideUp">Slide Up</SelectItem>
                        <SelectItem value="slideDown">Slide Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customJson">Custom JSON Configuration</Label>
                  <Textarea
                    id="customJson"
                    value={customJson}
                    onChange={(e) => setCustomJson(e.target.value)}
                    placeholder="Enter Shotstack JSON configuration"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {/* Render Button */}
            <Button 
              onClick={handleRender} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rendering Video...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Render Video
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Results
            </CardTitle>
            <CardDescription>
              View render results and video output
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {result.success ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertDescription>
                        Video rendered successfully!
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label>Render ID</Label>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {result.data?.response.id}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckStatus(result.data?.response.id || '')}
                        >
                          Check Status
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Badge variant={result.data?.response.status === 'done' ? 'default' : 'secondary'}>
                        {result.data?.response.status}
                      </Badge>
                    </div>

                    {result.data?.response.url && (
                      <div className="space-y-2">
                        <Label>Video URL</Label>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                            {result.data.response.url}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(result.data?.response.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {result.data?.response.url && (
                      <div className="space-y-2">
                        <Label>Video Preview</Label>
                        <video
                          controls
                          className="w-full rounded-lg"
                          src={result.data.response.url}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <strong>Error:</strong> {result.error}
                      {result.details && (
                        <div className="mt-2 text-sm">
                          <strong>Details:</strong> {result.details}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results yet. Configure your video and click "Render Video" to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Examples */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>
            Try these pre-configured examples to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setVideoType('text');
                setTextSettings(prev => ({
                  ...prev,
                  text: 'Welcome to Shotstack!',
                  background: '#1e40af',
                  fontColor: '#ffffff',
                }));
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Welcome Text
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setVideoType('image-text');
                setImageTextSettings(prev => ({
                  ...prev,
                  imageUrl: 'https://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg',
                  text: 'Beautiful Mountain View',
                }));
              }}
            >
              <Image className="mr-2 h-4 w-4" />
              Image + Text
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setVideoType('slideshow');
                setSlideshowSettings(prev => ({
                  ...prev,
                  images: 'https://shotstack-assets.s3.amazonaws.com/images/waterfall-square.jpg\nhttps://shotstack-assets.s3.amazonaws.com/images/mountain-square.jpg\nhttps://shotstack-assets.s3.amazonaws.com/images/beach-square.jpg',
                  transition: 'fade',
                }));
              }}
            >
              <Video className="mr-2 h-4 w-4" />
              Photo Slideshow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
