---
title: "Unitree at ten: what I saw in Hangzhou"
description: I spent 22 October at Unitree's World Physical AI Conference in
  Hangzhou. The H2-X made its public debut and snapped a leg by the afternoon.
  Unitree launched a $10 million competition, and the conversation I'll remember
  was with its engineers, who build their whole RL pipeline themselves.
date: 2026-11-03
image: /assets/uploads/unitree-hangzhou-2026.jpg
social_image: /assets/uploads/unitree-hangzhou-2026-social.jpg
published: true
---
On the morning of 22 October, Unitree showed the H2-X to the public for the first time, with a row of them waving people through the doors in Hangzhou. By the afternoon, an H2-X had snapped a leg halfway through a stunt in front of a crowd.

Strangely, that's the moment that made me respect Unitree more.

The event was Unitree's World Partner Conference, renamed the World Physical AI Conference for the company's tenth anniversary and held at the Hangzhou International Expo Center (Phase 2). Distributors and developers flew in from all over to see what's coming next. I mainly wanted to see how much of it works when it isn't on a slide.

## The H2-X at the door

Launching a robot by making it the welcome committee is a confident move. Next to the H2-X line sat the GD01, the one you climb into and strap yourself to, which can carry a full-sized adult. Nobody rode it, and it stayed a static display all day.

Just past registration, a group of G1s walked on stage and danced in sync, fully autonomously. It runs on Unitree's Swarm repository, which they released a while ago so partners can build their own multi robot routines. I think that's a clever release. Every distributor in that room can now go home and put on the same show for their own customers.

## The exhibition

For me the G1 Plus was the hardware update that mattered. Same frame, newer actuators, a quick release battery, two more degrees of freedom in the neck, and mics and speakers built in. And it keeps running while it's plugged in. If you've ever lost half a day to swapping packs and rebooting a humanoid between test runs, you'll understand why I care about that one.

The quadruped area had the most variety in the building. There were dogs in costume for a lion dance, and others dressed as a deer and a rhino. There was a Go2 education kit with a test bench that broke out the motors, voltage rails and cameras, next to a Go2 on a pedestal so students can train gaits without it wandering off the desk. Then the industrial kit: a B1 loaded with survey and scanning sensors, an A2W with a cobot arm on top, and an A2 rigged to carry a hiker's backpack.

Inspire's stand was the thing I found most fascinating. They had their whole range of robot hands out, and each one was built around a different trade off. Some were about force sensing, some about precise torque control, and some could grip a lot harder than anything their competitors make. Which one you'd pick depends entirely on the robot and the job.

Close by was an A2 with an R1 torso fixed on top. It looks a bit odd, a humanoid from the waist up on a robot dog, but it means you can manipulate things like a humanoid and still cross rough ground like a quadruped.

Unitree also put its software on show. A G1D (a G1 on an AMR base) folded clothes using whole body teleoperation, and in a mock living room a robot tidied a sofa and put the cushions back where they belonged.

## The keynote

The whole keynote was in Chinese. Everyone got an earpiece with live translation, which is the only reason I followed any of it.

Wang Jian, who founded Alibaba Cloud and now runs Zhejiang Lab, talked about how far back he goes with Unitree. Wenjun Zeng from EIT Ningbo spoke about digital twins and world and action models. Then Jake Laser came out. He's the YouTuber who built a chair on a B2W for his dad, who is paralysed from the waist down, and he brought the actual robot on stage.

Wang Xingxing gave the main talk. He started Unitree with Laikago, and his pitch this time was simple: AI has already won a lot of the digital world, so take it and put it into robots. He had Dario Amodei and Geoffrey Hinton quoted on screen on recursive self improvement, then showed robots trained in digital environments doing the same tasks in physical ones. His timeline for robots becoming common and doing useful work is one to three years, and he said it with a lot of confidence.

He kept coming back to global collaboration. One slide traced the whole chain behind where we are now: Google's Transformer, NVIDIA GPUs, DeepSeek, OpenAI's GPT models, GitHub, PyTorch, and Unitree's own robots in there too.

Then came the big announcement, the World Physical AI Competition. It has eight categories (locomotion, athletics, combat, dexterity, production, sports, multimodal HRI and healthcare) and up to $10 million in prize money. They also launched the Unitree Startup and Innovation Programme, which looks a lot like NVIDIA Inception: early access and development support for startups building on their hardware, whether that's components, simulation, models or industrial applications.

## Outside the main hall

I slipped out during a conversation between Unitree's leadership and Yao Ming about how human and robot dexterity differ on a basketball court and went back outside. The quadrupeds were working over rough terrain while Unitree's management software ran SLAM live on a screen, localising and building the map as they went. This is the bit a customer ends up deploying, and it rarely gets much space at shows, so I was glad to see it.

G1s were climbing onto tall boxes and jumping back down. Then the H2-X went for its stunt and the leg went. Nobody wants that at their own anniversary. But the tech is early, everyone in that crowd knew it, and plenty of companies would only ever show you the edited video. Unitree brought the robots out live and let them fail in public.

The second hall was more fun. A G1 played table tennis against a person. Another sat in a go-kart and raced a human driver. Two G1s played tennis against each other, all autonomous. IMA Create had a full G1 band playing guitar, keyboard and drums live, and Yijing Technology had built an expressive face you can mount on any G1 so it feels a bit more human to talk to.

Lunch meant queuing with a coupon in a hall where, of course, another G1 swarm was dancing to Western pop. Afterwards I sat in on the embodied intelligence VC forum for a while and watched startups pitch. A few sub-forums, including the international partner session, were closed to people like me.

## What the engineers told me

The conversation I'll remember was with the Unitree engineers who build the teleoperation demos. Most of them don't speak English, and most of the tools the rest of us lean on (MuJoCo, Isaac Gym, Isaac Lab) are English first. So, from what they described, they collect their own data and run the whole RL pipeline on things they've written themselves, right down to the maths that gets a robot to repeat a motion.

Outside China it's easy to assume everyone's stack goes through the same handful of frameworks. This team is shipping whole body teleop and autonomous demos without leaning on them, and I hadn't properly appreciated that until I asked.

## What I took away

The hardware is still the hard part. I keep thinking about that leg. It's a more honest picture of where humanoids are right now than anything on the keynote slides.

The other thing I left with is that Unitree is selling a platform as much as robots. They open up repos like Swarm and the teleop stack, partners like Inspire build on top, and the competition and startup programme put money behind it. In my experience the robot is rarely what holds a deployment up. It's everything around it, and that seems to be where Unitree is putting its effort.

I'm based in London. If you're building on Unitree hardware, working on legged robots or trying to get physical AI into production, I'd like to hear from you.