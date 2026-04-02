import {
  WorkflowNode, Connection, WorkflowProject,
  createTextNode, createImageNode, createVideoNode,
  TextNode, ImageNodeData, VideoNodeData,
} from './workflow-projects';
import { imageModels } from './models';
import { videoModels } from './video-models';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  category: string;
  color: string;
  icon: string;
  isPopular: boolean;
}

export const workflows: Workflow[] = [
  {
    id: 'wf-001',
    name: 'Product Photo Studio',
    description: 'Generate professional product photography from simple object photos',
    steps: 4,
    category: 'E-Commerce',
    color: '#3b82f6',
    icon: '📦',
    isPopular: true,
  },
  {
    id: 'wf-002',
    name: 'Social Media Pack',
    description: 'Create a full social media content pack from a single concept',
    steps: 6,
    category: 'Marketing',
    color: '#8b5cf6',
    icon: '📱',
    isPopular: true,
  },
  {
    id: 'wf-003',
    name: 'Character Designer',
    description: 'Design consistent characters across multiple poses and styles',
    steps: 5,
    category: 'Art',
    color: '#ec4899',
    icon: '🎨',
    isPopular: false,
  },
  {
    id: 'wf-004',
    name: 'Video Ad Creator',
    description: 'Turn your product images into engaging video advertisements',
    steps: 7,
    category: 'Advertising',
    color: '#f59e0b',
    icon: '🎥',
    isPopular: true,
  },
  {
    id: 'wf-005',
    name: 'Brand Kit Generator',
    description: 'Generate complete brand identity from a text description',
    steps: 8,
    category: 'Branding',
    color: '#10b981',
    icon: '✨',
    isPopular: false,
  },
  {
    id: 'wf-006',
    name: 'Moodboard to Scene',
    description: 'Transform moodboard collections into fully rendered scenes',
    steps: 3,
    category: 'Design',
    color: '#6366f1',
    icon: '🖼️',
    isPopular: false,
  },
];

// ─── Template Builders ──────────────────────────────────
// Each template generates a pre-built workflow with nodes & connections

function getImageModel(id: string) {
  return imageModels.find((m) => m.id === id) || imageModels[0];
}

function getVideoModel(id: string) {
  return videoModels.find((m) => m.id === id) || videoModels[0];
}

export function buildTemplateProject(templateId: string): { nodes: WorkflowNode[]; connections: Connection[] } {
  switch (templateId) {
    case 'wf-001': return buildProductPhotoStudio();
    case 'wf-002': return buildSocialMediaPack();
    case 'wf-003': return buildCharacterDesigner();
    case 'wf-004': return buildVideoAdCreator();
    case 'wf-005': return buildBrandKitGenerator();
    case 'wf-006': return buildMoodboardToScene();
    default: return { nodes: [], connections: [] };
  }
}

// ─── Product Photo Studio ───────────────────────────────
function buildProductPhotoStudio(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 120);
  (t1 as TextNode).content = 'Product: A minimalist ceramic mug on a wooden table. Clean, white background. Soft studio lighting with subtle shadow.';

  const img1 = createImageNode(360, 40);
  const m1 = getImageModel('imagen4-ultra');
  (img1 as ImageNodeData).model = m1;
  (img1 as ImageNodeData).prompt = 'Professional product photograph, studio lighting, white seamless background, 4K';
  (img1 as ImageNodeData).quality = '4K';
  (img1 as ImageNodeData).aspectRatio = '1:1';

  const img2 = createImageNode(360, 300);
  const m2 = getImageModel('seedream-5-lite');
  (img2 as ImageNodeData).model = m2;
  (img2 as ImageNodeData).prompt = 'Lifestyle product shot, natural environment, warm tones, bokeh background';
  (img2 as ImageNodeData).quality = '2K';
  (img2 as ImageNodeData).aspectRatio = '4:3';

  const img3 = createImageNode(700, 160);
  const m3 = getImageModel('recraft-upscale');
  (img3 as ImageNodeData).model = m3;
  (img3 as ImageNodeData).prompt = 'Enhance and upscale product image, crisp details, sharp focus';
  (img3 as ImageNodeData).quality = '4K';

  const nodes: WorkflowNode[] = [t1, img1, img2, img3];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: img1.id, toPortId: img1.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: img2.id, toPortId: img2.ports[0].id },
    { id: `conn_tpl_3`, fromNodeId: img1.id, fromPortId: img1.ports[1].id, toNodeId: img3.id, toPortId: img3.ports[0].id },
  ];

  return { nodes, connections };
}

// ─── Social Media Pack ──────────────────────────────────
function buildSocialMediaPack(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 180);
  (t1 as TextNode).content = 'Campaign: Summer collection launch. Bright, tropical vibes. Target audience: young adults 18-30.';

  const imgSquare = createImageNode(360, 20);
  const m1 = getImageModel('nano-banana-2');
  (imgSquare as ImageNodeData).model = m1;
  (imgSquare as ImageNodeData).prompt = 'Instagram post, vibrant tropical summer theme, product showcase, square format';
  (imgSquare as ImageNodeData).aspectRatio = '1:1';
  (imgSquare as ImageNodeData).quality = '2K';

  const imgStory = createImageNode(360, 260);
  (imgStory as ImageNodeData).model = m1;
  (imgStory as ImageNodeData).prompt = 'Instagram story, vertical format, bold typography area, summer campaign';
  (imgStory as ImageNodeData).aspectRatio = '9:16';
  (imgStory as ImageNodeData).quality = '2K';

  const imgBanner = createImageNode(360, 500);
  const m2 = getImageModel('seedream-4-5');
  (imgBanner as ImageNodeData).model = m2;
  (imgBanner as ImageNodeData).prompt = 'Facebook/Twitter banner, wide landscape, summer collection montage';
  (imgBanner as ImageNodeData).aspectRatio = '16:9';
  (imgBanner as ImageNodeData).quality = '2K';

  const vid1 = createVideoNode(720, 100);
  const vm1 = getVideoModel('kling-3');
  (vid1 as VideoNodeData).model = vm1;
  (vid1 as VideoNodeData).prompt = 'Instagram reel, dynamic product reveal, tropical background, trendy transitions';
  (vid1 as VideoNodeData).aspectRatio = '9:16';
  (vid1 as VideoNodeData).duration = 8;

  const vid2 = createVideoNode(720, 380);
  const vm2 = getVideoModel('seedance-1-5-pro');
  (vid2 as VideoNodeData).model = vm2;
  (vid2 as VideoNodeData).prompt = 'TikTok ad, energetic summer vibes, product highlight, engaging hook';
  (vid2 as VideoNodeData).aspectRatio = '9:16';
  (vid2 as VideoNodeData).duration = 6;

  const nodes: WorkflowNode[] = [t1, imgSquare, imgStory, imgBanner, vid1, vid2];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgSquare.id, toPortId: imgSquare.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgStory.id, toPortId: imgStory.ports[0].id },
    { id: `conn_tpl_3`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgBanner.id, toPortId: imgBanner.ports[0].id },
    { id: `conn_tpl_4`, fromNodeId: imgSquare.id, fromPortId: imgSquare.ports[1].id, toNodeId: vid1.id, toPortId: vid1.ports[0].id },
    { id: `conn_tpl_5`, fromNodeId: imgStory.id, fromPortId: imgStory.ports[1].id, toNodeId: vid2.id, toPortId: vid2.ports[0].id },
  ];

  return { nodes, connections };
}

// ─── Character Designer ─────────────────────────────────
function buildCharacterDesigner(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 160);
  (t1 as TextNode).content = 'Character: A young sorcerer with silver hair, violet eyes, dark robes with glowing runes. Fantasy RPG style, anime-inspired.';

  const imgFront = createImageNode(360, 20);
  const m1 = getImageModel('nano-banana-pro');
  (imgFront as ImageNodeData).model = m1;
  (imgFront as ImageNodeData).prompt = 'Character concept art, front view, full body, T-pose, fantasy sorcerer, detailed outfit, white background';
  (imgFront as ImageNodeData).aspectRatio = '2:3';
  (imgFront as ImageNodeData).quality = '2K';

  const imgSide = createImageNode(360, 280);
  (imgSide as ImageNodeData).model = m1;
  (imgSide as ImageNodeData).prompt = 'Character concept art, side profile view, full body, fantasy sorcerer, same design as front view';
  (imgSide as ImageNodeData).aspectRatio = '2:3';
  (imgSide as ImageNodeData).quality = '2K';

  const imgAction = createImageNode(700, 50);
  const m2 = getImageModel('imagen4-ultra');
  (imgAction as ImageNodeData).model = m2;
  (imgAction as ImageNodeData).prompt = 'Dynamic action pose, casting spell with glowing magic, dramatic lighting, cinematic';
  (imgAction as ImageNodeData).aspectRatio = '16:9';
  (imgAction as ImageNodeData).quality = '4K';

  const imgExpression = createImageNode(700, 310);
  (imgExpression as ImageNodeData).model = m2;
  (imgExpression as ImageNodeData).prompt = 'Character expression sheet, multiple facial expressions grid, happy angry surprised calm, bust shots';
  (imgExpression as ImageNodeData).aspectRatio = '1:1';
  (imgExpression as ImageNodeData).quality = '4K';

  const vidTurnaround = createVideoNode(1060, 180);
  const vm1 = getVideoModel('kling-3');
  (vidTurnaround as VideoNodeData).model = vm1;
  (vidTurnaround as VideoNodeData).prompt = '360 degree character turnaround, smooth camera orbit, fantasy sorcerer character';
  (vidTurnaround as VideoNodeData).aspectRatio = '1:1';
  (vidTurnaround as VideoNodeData).duration = 8;

  const nodes: WorkflowNode[] = [t1, imgFront, imgSide, imgAction, imgExpression, vidTurnaround];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgFront.id, toPortId: imgFront.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgSide.id, toPortId: imgSide.ports[0].id },
    { id: `conn_tpl_3`, fromNodeId: imgFront.id, fromPortId: imgFront.ports[1].id, toNodeId: imgAction.id, toPortId: imgAction.ports[0].id },
    { id: `conn_tpl_4`, fromNodeId: imgFront.id, fromPortId: imgFront.ports[1].id, toNodeId: imgExpression.id, toPortId: imgExpression.ports[0].id },
    { id: `conn_tpl_5`, fromNodeId: imgAction.id, fromPortId: imgAction.ports[1].id, toNodeId: vidTurnaround.id, toPortId: vidTurnaround.ports[0].id },
  ];

  return { nodes, connections };
}

// ─── Video Ad Creator ───────────────────────────────────
function buildVideoAdCreator(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 60);
  (t1 as TextNode).content = 'Brand: LunaFit activewear. Tagline: "Move with confidence." Athletic, modern, empowering.';

  const t2 = createTextNode(60, 320);
  (t2 as TextNode).content = 'Script:\n1. Opening hook (2s)\n2. Product showcase (3s)\n3. Action montage (3s)\n4. Logo + CTA (2s)';

  const img1 = createImageNode(380, 20);
  const m1 = getImageModel('seedream-5-lite');
  (img1 as ImageNodeData).model = m1;
  (img1 as ImageNodeData).prompt = 'Product flat lay, athletic leggings, sports bra, modern minimalist background, studio lighting';
  (img1 as ImageNodeData).aspectRatio = '16:9';
  (img1 as ImageNodeData).quality = '2K';

  const img2 = createImageNode(380, 280);
  const m2 = getImageModel('imagen4-fast');
  (img2 as ImageNodeData).model = m2;
  (img2 as ImageNodeData).prompt = 'Athletic woman doing yoga on rooftop at sunset, wearing activewear, cinematic lighting';
  (img2 as ImageNodeData).aspectRatio = '16:9';
  (img2 as ImageNodeData).quality = '2K';

  const img3 = createImageNode(380, 520);
  (img3 as ImageNodeData).model = m2;
  (img3 as ImageNodeData).prompt = 'Brand end card, "LunaFit" logo, "Move with confidence" tagline, dark gradient background';
  (img3 as ImageNodeData).aspectRatio = '16:9';
  (img3 as ImageNodeData).quality = '2K';

  const vid1 = createVideoNode(740, 40);
  const vm1 = getVideoModel('kling-3');
  (vid1 as VideoNodeData).model = vm1;
  (vid1 as VideoNodeData).prompt = 'Product showcase video, activewear rotating on mannequin, smooth camera motion, studio';
  (vid1 as VideoNodeData).aspectRatio = '16:9';
  (vid1 as VideoNodeData).duration = 5;

  const vid2 = createVideoNode(740, 300);
  const vm2 = getVideoModel('seedance-1-5-pro');
  (vid2 as VideoNodeData).model = vm2;
  (vid2 as VideoNodeData).prompt = 'Athletic movement montage, running, stretching, power moves, dynamic camera, motivational';
  (vid2 as VideoNodeData).aspectRatio = '16:9';
  (vid2 as VideoNodeData).duration = 8;

  const vidFinal = createVideoNode(1100, 180);
  const vm3 = getVideoModel('sora2-pro');
  (vidFinal as VideoNodeData).model = vm3;
  (vidFinal as VideoNodeData).prompt = 'Complete 30s video ad, seamless transitions, opening hook → product → action → logo end card';
  (vidFinal as VideoNodeData).aspectRatio = '16:9';
  (vidFinal as VideoNodeData).duration = 10;

  const nodes: WorkflowNode[] = [t1, t2, img1, img2, img3, vid1, vid2, vidFinal];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: img1.id, toPortId: img1.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: t2.id, fromPortId: t2.ports[0].id, toNodeId: img2.id, toPortId: img2.ports[0].id },
    { id: `conn_tpl_3`, fromNodeId: t2.id, fromPortId: t2.ports[0].id, toNodeId: img3.id, toPortId: img3.ports[0].id },
    { id: `conn_tpl_4`, fromNodeId: img1.id, fromPortId: img1.ports[1].id, toNodeId: vid1.id, toPortId: vid1.ports[0].id },
    { id: `conn_tpl_5`, fromNodeId: img2.id, fromPortId: img2.ports[1].id, toNodeId: vid2.id, toPortId: vid2.ports[0].id },
    { id: `conn_tpl_6`, fromNodeId: vid1.id, fromPortId: vid1.ports[1].id, toNodeId: vidFinal.id, toPortId: vidFinal.ports[0].id },
    { id: `conn_tpl_7`, fromNodeId: vid2.id, fromPortId: vid2.ports[1].id, toNodeId: vidFinal.id, toPortId: vidFinal.ports[0].id },
  ];

  return { nodes, connections };
}

// ─── Brand Kit Generator ────────────────────────────────
function buildBrandKitGenerator(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 100);
  (t1 as TextNode).content = 'Brand: "Aether" — A premium wellness brand. Earthy tones, minimalist, zen-inspired. Target: health-conscious millennials.';

  const t2 = createTextNode(60, 380);
  (t2 as TextNode).content = 'Color palette: Deep forest green (#1a3c2a), cream (#f5f0e8), terracotta (#c4724e), matte gold (#b8a088).\nTypography: Modern serif + clean sans-serif.';

  const imgLogo = createImageNode(380, 20);
  const m1 = getImageModel('ideogram-v3');
  (imgLogo as ImageNodeData).model = m1;
  (imgLogo as ImageNodeData).prompt = 'Minimalist brand logo "Aether", modern serif typography, zen-inspired symbol, clean white background';
  (imgLogo as ImageNodeData).aspectRatio = '1:1';
  (imgLogo as ImageNodeData).quality = '2K';

  const imgCard = createImageNode(380, 270);
  const m2 = getImageModel('nano-banana-2');
  (imgCard as ImageNodeData).model = m2;
  (imgCard as ImageNodeData).prompt = 'Premium business card mockup, front and back, Aether brand, earthy tones, gold foil detail';
  (imgCard as ImageNodeData).aspectRatio = '16:9';
  (imgCard as ImageNodeData).quality = '4K';

  const imgPackaging = createImageNode(380, 520);
  const m3 = getImageModel('imagen4-ultra');
  (imgPackaging as ImageNodeData).model = m3;
  (imgPackaging as ImageNodeData).prompt = 'Product packaging mockup, premium box and bottle, Aether wellness brand, studio photography';
  (imgPackaging as ImageNodeData).aspectRatio = '4:3';
  (imgPackaging as ImageNodeData).quality = '4K';

  const imgSocial = createImageNode(740, 40);
  (imgSocial as ImageNodeData).model = m2;
  (imgSocial as ImageNodeData).prompt = 'Social media brand kit, Instagram grid layout, Aether brand, consistent color palette, templates';
  (imgSocial as ImageNodeData).aspectRatio = '1:1';
  (imgSocial as ImageNodeData).quality = '2K';

  const imgMockup = createImageNode(740, 290);
  (imgMockup as ImageNodeData).model = m3;
  (imgMockup as ImageNodeData).prompt = 'Brand identity presentation mockup, stationery suite, letterhead, envelope, notebook, Aether brand';
  (imgMockup as ImageNodeData).aspectRatio = '16:9';
  (imgMockup as ImageNodeData).quality = '4K';

  const vidIntro = createVideoNode(1080, 160);
  const vm1 = getVideoModel('sora2-pro');
  (vidIntro as VideoNodeData).model = vm1;
  (vidIntro as VideoNodeData).prompt = 'Animated brand intro, logo reveal, Aether wellness, organic flowing elements, zen atmosphere';
  (vidIntro as VideoNodeData).aspectRatio = '16:9';
  (vidIntro as VideoNodeData).duration = 8;

  const nodes: WorkflowNode[] = [t1, t2, imgLogo, imgCard, imgPackaging, imgSocial, imgMockup, vidIntro];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgLogo.id, toPortId: imgLogo.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgCard.id, toPortId: imgCard.ports[0].id },
    { id: `conn_tpl_3`, fromNodeId: t2.id, fromPortId: t2.ports[0].id, toNodeId: imgPackaging.id, toPortId: imgPackaging.ports[0].id },
    { id: `conn_tpl_4`, fromNodeId: imgLogo.id, fromPortId: imgLogo.ports[1].id, toNodeId: imgSocial.id, toPortId: imgSocial.ports[0].id },
    { id: `conn_tpl_5`, fromNodeId: imgCard.id, fromPortId: imgCard.ports[1].id, toNodeId: imgMockup.id, toPortId: imgMockup.ports[0].id },
    { id: `conn_tpl_6`, fromNodeId: imgSocial.id, fromPortId: imgSocial.ports[1].id, toNodeId: vidIntro.id, toPortId: vidIntro.ports[0].id },
  ];

  return { nodes, connections };
}

// ─── Moodboard to Scene ─────────────────────────────────
function buildMoodboardToScene(): { nodes: WorkflowNode[]; connections: Connection[] } {
  const t1 = createTextNode(60, 80);
  (t1 as TextNode).content = 'Mood: Cozy autumn cabin interior. Warm amber lighting, wooden beams, stone fireplace, soft blankets, steaming coffee, rain outside.';

  const imgScene = createImageNode(380, 40);
  const m1 = getImageModel('imagen4-ultra');
  (imgScene as ImageNodeData).model = m1;
  (imgScene as ImageNodeData).prompt = 'Photorealistic cozy cabin interior, warm amber lighting, stone fireplace, wooden beams, autumn evening';
  (imgScene as ImageNodeData).aspectRatio = '16:9';
  (imgScene as ImageNodeData).quality = '4K';

  const vidScene = createVideoNode(740, 60);
  const vm1 = getVideoModel('kling-3');
  (vidScene as VideoNodeData).model = vm1;
  (vidScene as VideoNodeData).prompt = 'Slow cinematic pan through cozy cabin, crackling fireplace, rain on windows, ambient warm light';
  (vidScene as VideoNodeData).aspectRatio = '16:9';
  (vidScene as VideoNodeData).duration = 10;

  const nodes: WorkflowNode[] = [t1, imgScene, vidScene];
  const connections: Connection[] = [
    { id: `conn_tpl_1`, fromNodeId: t1.id, fromPortId: t1.ports[0].id, toNodeId: imgScene.id, toPortId: imgScene.ports[0].id },
    { id: `conn_tpl_2`, fromNodeId: imgScene.id, fromPortId: imgScene.ports[1].id, toNodeId: vidScene.id, toPortId: vidScene.ports[0].id },
  ];

  return { nodes, connections };
}
